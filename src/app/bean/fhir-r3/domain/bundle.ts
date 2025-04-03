import { BlockEvent } from '../../simple.types';
import { CautelarBlockCodes, cautelarBlockDisplay, PRESCRIPTION_ACTION } from '../../constants';
import { mapFhirToPrescription, Prescription } from '../../models/prescription';
import { mapFhirToProduct, Product } from '../../models/product';
import { FhirTypes, FhirValue } from '../fhir-constants';
import { FhirContained, FhirDeviceRequestUrl, FhirRequestGroupActionUrl, FhirRequestGroupUrl, FhirUrlExtensions } from '../fhir-url-constants';
import { createOrModifyExtension } from '../mappers/fhir-extension.mapper';
import { BundleEntry, BundleLink, Bundle } from './interfaces/bundle.interface';
import { FhirResource, Identifier, Signature, Meta, Coding, CodeableConcept, Extension } from './interfaces/common.interface';
import { DeviceRequest } from './interfaces/device-request.interface';
import { Device } from './interfaces/device.interface';
import { RequestGroup, RequestGroupAction } from './interfaces/request-group.interface';
import { mapFhirToProfesional } from '../../models/profesional';
import { Practitioner } from './interfaces/practitioner.interface';
import { Organization } from './interfaces/organization.interface';
import { Observation } from './interfaces/observation';

export class BundleModel implements Bundle {
    readonly resourceType = 'Bundle';
    entry?: BundleEntry<FhirResource>[];
    identifier?: Identifier;
    link?: BundleLink[];
    signature?: Signature;
    total?: number;
    type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;

    constructor(bundle: Bundle) {
        this.entry = bundle.entry;
        this.identifier = bundle.identifier;
        this.signature = bundle.signature;
        this.link = bundle.link;
        this.total = bundle.total;
        this.type = bundle.type;
        this.id = bundle.id;
        this.implicitRules = bundle.implicitRules;
        this.language = bundle.language;
        this.meta = bundle.meta;
    }

    mapToPrescriptionModel(): Prescription[] {
        const result: Prescription[] = [];
        this.entry?.filter(e => e.resource?.resourceType === FhirTypes.REQUEST_GROUP)
            .map(res => res.resource as RequestGroup).forEach(
                req => {
                    let profesional;
                    const practitioner = this.getResourceByReference(req.author?.reference);
                    if (practitioner) profesional = mapFhirToProfesional(practitioner as Practitioner);
                    const organizationReference = req.extension?.find(e => e.url === FhirRequestGroupUrl.SERVICE_PROVIDER)?.valueReference?.reference;
                    const organization = this.getResourceByReference(organizationReference);
                    const products = this.mapProducts(req.action);
                    const model = mapFhirToPrescription(req, products, profesional, organization as Organization, this.getMotive(req));
                    result.push(model);
                }
            );
        return result;
    }

    private getResourceByReference(reference?: string): FhirResource | undefined {
        if (!reference) return undefined;
        const type = reference.split('/')[0];
        const id = reference.split('/')[1];
        return this.entry?.find(e => e.resource?.resourceType === type && e.resource.id === id)?.resource;
    }

    private mapProducts(action?: RequestGroupAction[]): Product[] {
        const result: Product[] = [];
        if (action) {
            action.map(a => a.resource?.reference).forEach(
                ref => {
                    if (ref && ref.includes(FhirTypes.DEVICE_REQUEST)) {
                        const deviceRequest: DeviceRequest | undefined =
                            this.getResourceByReference(ref) ? this.getResourceByReference(ref) as DeviceRequest : undefined;
                        const device: Device | undefined =
                            (deviceRequest?.codeReference?.reference) ?
                                this.getResourceByReference(deviceRequest.codeReference.reference) as Device : undefined;
                        const product = mapFhirToProduct(deviceRequest, device);
                        result.push(product);
                    }
                }
            );
        }
        return result;
    }

    updateDataByPrescriptions(prescriptions: Prescription[], center: Coding) {
        const entryChanges: string[] = [];
        prescriptions.forEach(pres => {
            this.modifyEntryExtension(
                pres.id,
                FhirRequestGroupUrl.PRESCRIPTION_STATUS,
                <Coding>{ code: pres.status.code, display: pres.status.display });

            entryChanges.push(pres.id);
            pres.products.forEach(prod => {
                this.modifyEntryExtension(prod.request, FhirDeviceRequestUrl.QUANTITY_DISPENSED, prod.units.value.toString());
                this.modifyEntryExtension(prod.request, FhirDeviceRequestUrl.PRICE, prod.pvp?.value?.toString());
                this.modifyEntryExtension(prod.request, FhirDeviceRequestUrl.TAX_PRICE, prod.pvp?.valueTax?.toString());
                this.modifyEntryExtension(prod.request, FhirDeviceRequestUrl.TAX, prod.pvp?.tax?.toString());
                this.modifyEntryExtension(prod.request, FhirDeviceRequestUrl.REAL_APORTATION, prod.userConsideration?.realAportation?.toString());
                this.modifyEntryExtension(prod.request, FhirDeviceRequestUrl.FULL_PRICE, prod.pvp?.total?.toString());
                if (prod.brand) {
                    this.modifyEntryExtension(
                        prod.request,
                        FhirDeviceRequestUrl.DISPENSED_BRAND,
                        <Coding>{ code: prod.brand?.code, display: prod.brand?.description }
                    );
                }
                entryChanges.push(prod.request);
            });
            this.addDispensableCenter(pres, center);
        });
        return this.entry?.filter(e => entryChanges.includes(e.resource?.id || ''));
    }

    addBlockExtension(block: BlockEvent, profesional: string, center: Coding) {
        const blockDefinition: CodeableConcept = {
            coding: [{
                code: block.motive.code,
                display: block.motive.display
            }],
            text: block.observation
        };

        const blockState: CodeableConcept = {
            coding: [{
                code: CautelarBlockCodes.PENDING,
                display: cautelarBlockDisplay[CautelarBlockCodes.PENDING]
            }],
            text: FhirValue.YES
        };
        this.modifyEntryExtension(block.prescription.id, FhirRequestGroupUrl.PRECAUTIONARY_BLOCKING, blockState);
        this.addEntryAction(block.prescription, profesional, center, { block: blockDefinition });
    }

    addDispensableCenter(prescription: Prescription, center: Coding) {
        this.modifyEntryExtension(prescription.id, FhirRequestGroupUrl.DISPENSING_CENTER, center);
    }

    addOrRefreshValidityDate(prescriptionsId: string, thresholdDays: number) {
        const futureTime = new Date().getTime() + (thresholdDays * 24 * 60 * 60 * 1000);
        const newDate = new Date(futureTime);
        this.modifyEntryExtension(prescriptionsId, FhirRequestGroupUrl.VALIDITY_DATE, newDate);
    }

    addDispensationExtensions(prescriptions: Prescription[]) {
        prescriptions.forEach(pres => {
            this.modifyEntryExtension(pres.id, FhirRequestGroupUrl.DISPENSATION_DATE, pres.dispenseDate || new Date());
            this.modifyEntryExtension(pres.id, FhirRequestGroupUrl.PARECYL_BILLING, pres.reimbursement ? FhirValue.NO : FhirValue.YES);
            this.modifyEntryExtension(pres.id, FhirRequestGroupUrl.PAYED, FhirValue.YES);
        });
    }

    addBillingCodes(dispensations: Prescription[], billingCode?: string) {
        dispensations.forEach(disp => {
            this.modifyEntryExtension(disp.id, FhirRequestGroupUrl.ESTABLISHMENT_BILLING, billingCode);
        });
    }

    private modifyEntryExtension(
        id: string, url: FhirUrlExtensions, value: Partial<string | Date | CodeableConcept | Extension | Coding | undefined>) {

        this.entry = this.entry?.map(entry => {
            if (entry?.resource?.id === id && value !== undefined) {
                entry.resource.extension = createOrModifyExtension(entry.resource.extension, url, value);
            }
            return entry;
        });
    }

    private removeEntryExtension(
        id: string, url: FhirUrlExtensions) {

        this.entry = this.entry?.filter(entry => {
            if (entry?.resource?.id === id) {
                entry.resource.extension = entry.resource.extension?.filter(e => e.url === url);
            }
            return entry;
        });
    }

    addEntryAction(prescription: Prescription, profId: string, center: Coding, extras?: { block?: CodeableConcept, description?: string }) {
        this.entry = this.entry?.map(entry => {
            if (entry?.resource?.id === prescription.id) {
                const result = entry.resource as RequestGroup;
                if (!result.action) result.action = [];

                const state: Coding = {
                    code: prescription.status.code,
                    display: prescription.status.display,
                    system: FhirRequestGroupUrl.PRESCRIPTION_STATUS
                };
                const extensions: Extension[] = [
                    { url: FhirRequestGroupActionUrl.DISPENSING_CENTER, valueCoding: center },
                    { url: FhirRequestGroupActionUrl.VERSION, valueString: (prescription.version + 1).toString() }
                ];
                if (extras?.block)
                    extensions.push({ url: FhirRequestGroupActionUrl.BLOCK, valueCodeableConcept: extras.block });

                result.action.push({
                    label: PRESCRIPTION_ACTION,
                    participant: [
                        { reference: `${FhirTypes.PRACTITIONER}/${profId}` }
                    ],
                    code: state ? [{ coding: [state] }] : undefined,
                    timingDateTime: new Date(),
                    extension: extensions
                });
                return { resource: result };
            }
            return entry;
        });
    }

    getRequestGroupEntries(id: string): FhirResource[] {
        const result: FhirResource[] = [];
        const requestGroup: RequestGroup = this.entry?.find(
            e => e.resource?.resourceType === FhirTypes.REQUEST_GROUP && e.resource.id === id)?.resource as RequestGroup;
        if (requestGroup) {
            result.push(requestGroup);
            const practitioner = this.getResourceByReference(requestGroup.author?.reference);
            if (practitioner) result.push(practitioner);
            const organizationReference = requestGroup.extension?.find(
                e => e.url === FhirRequestGroupUrl.SERVICE_PROVIDER)?.valueReference?.reference;
            const organization = this.getResourceByReference(organizationReference);
            if (organization) result.push(organization);
            requestGroup.action?.map(a => a.resource?.reference).forEach(
                ref => {
                    if (ref && ref.includes(FhirTypes.DEVICE_REQUEST)) {
                        const deviceRequest: DeviceRequest | undefined =
                            this.getResourceByReference(ref) ? this.getResourceByReference(ref) as DeviceRequest : undefined;
                        if (deviceRequest) result.push(deviceRequest);
                        const device: Device | undefined =
                            (deviceRequest?.codeReference?.reference) ?
                                this.getResourceByReference(deviceRequest.codeReference.reference) as Device : undefined;
                        if (device) result.push(device);
                    }
                }
            );
        }
        return result;
    }

    getEntriesByEntries(entry?: BundleEntry<FhirResource>[]): BundleEntry<FhirResource>[] {
        const result: BundleEntry<FhirResource>[] = [];
        if (entry && entry.length > 0) {
            entry.forEach(entry => {
                const resource = this.entry?.find(e => e.resource?.id === entry.resource?.id);
                if (resource) result.push(resource);
                else result.push(entry);
            });
        }
        return result;
    }

    addEntries(entries: BundleEntry<FhirResource>[]) {
        if (this.entry) this.entry.push(...entries);
    }

    addMissingActions(requestGroupId: string, actions: RequestGroupAction[]) {
        const choosen = this.entry?.find(e =>
            e.resource?.resourceType === FhirTypes.REQUEST_GROUP && e.resource.id === requestGroupId) as RequestGroup;
        const addebleActions = actions.filter(a => {
            a.label === PRESCRIPTION_ACTION &&
                !choosen.action?.includes(a);
        });
        choosen.action?.concat(...addebleActions);
    }

    private getMotive(req: RequestGroup) {
        const reference =
            req.action?.find(a => a.resource?.reference && a.resource.reference.includes(FhirTypes.DEVICE_REQUEST))?.resource?.reference;
        const deviceRequest = this.getResourceByReference(reference) ? this.getResourceByReference(reference) as DeviceRequest : undefined;
        const observation = (deviceRequest?.contained?.find(c => c.id === FhirContained.REASON_REJECTED) as Observation | undefined);
        return observation?.valueString;
    }
}