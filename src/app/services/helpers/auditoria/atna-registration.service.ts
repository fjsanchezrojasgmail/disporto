import { Injectable } from '@angular/core';
import { Patient } from '../../../bean/fhir-r3/domain/interfaces/patient.interface';
import { Practitioner } from '../../../bean/fhir-r3/domain/interfaces/practitioner.interface';
import { AuditEventAppRS } from '../../../bean/fhir-r3/domain/interfaces/common.interface';
import { Coding } from '../../../bean/fhir-r3/domain/interfaces/common.interface';
import { ProfesionalService } from '../profesional/profesional.service';
import { AtnaRegistrationConstants, FhirPatient, FhirPractitionerUrl, FhirResourceType } from '../../../bean/constants';
import { Identifier } from '../../../bean/fhir-r3/domain/interfaces/common.interface';
import { Organization } from '../../../bean/fhir-r3/domain/interfaces/organization.interface';
import { Observable } from 'rxjs';
import { Establishment } from '../../../bean/models/administration';
import { ProfesionalAdm } from '../../../bean/models/profesional';
import { ConstantsService } from '../../../services/constants.service';
import { ConfigService } from '../../../services/config.service';
import { AtnaDaoService } from '../../dao/atna-dao.service';
import { SimplePatient } from '../../../bean/models/patient';
import { PatientModel } from '../../../bean/fhir-r3/domain/patient';


@Injectable(
  { providedIn: 'root' }
)
export class AtnaRegistrationService {
  private path_audit = '/auditEventApp';
  organizationCenter!: Organization;

  organizationCode!: string;
  organizationName!: string;
  organizationCIF!: string;

  profesional$: Observable<ProfesionalAdm | null>;
  center$: Observable<Establishment | null>;


  constructor(
    private profesionalService: ProfesionalService,
    private constants: ConstantsService,
    private config: ConfigService,
    private atnaService: AtnaDaoService

  ) {
    this.profesional$ = this.profesionalService.profesional$;
    this.center$ = this.profesionalService.center$;
  }

  private getUrl(url?: string) {
    return url + this.path_audit;
  }


  /**
    * Llama al servicio para crear la auditoría de un recurso
    * @param data respuesta de la petición
    * @param action acción por la que se audita
    * @param urlApi url base api hdr
    */
  callAuditCreate(data: any, patient: SimplePatient, action: any, urlApi: string) {

    console.log('Create audit: ',data,patient,action,this.getUrl(urlApi));
    //console.log(this.generateEntityReference(data, patient));

    return this.atnaService.create(
          this.getUrl(urlApi),
          this.generateJSONAudit(

              this.generateEntityReference(data,patient),action,urlApi)).subscribe(
                  () => {},
                  (error: any) => {
                    console.log(error);
                  }
              );



    // return this.atnaService.create(
    //   this.getUrl(urlApi),
    //   this.generateJSONAudit(
    //     this.generateEntityReference(
    //       data, patient), action, urlApi)).subscribe(
    //         () => { },
    //         (error: any) => {
    //           console.log(error);
    //         }
    //       );
  }


  /**
   * Genera la propiedad entityReference
   * @param data
   */
  //private generateEntityReference(data: Bundle | OperationOutcome, patient: Patient): string {
  private generateEntityReference(data: any, patient: SimplePatient): string {

    // data puede ser:
    // recurso tipo Bundle
    // recurso tipo OperationOutcome
    // array de n recursos
    // string


    let entityReference = '';

    //obtención de datos

    this.actualOrganizationCenter;

    /* console.log("Data: ",data);
    console.log("RequestGroup: ", data[0])
    console.log("Paciente: ", data[1].id);
    console.log("Paciente pasado: ", patient);
    console.log("Datos de organizacion: ",data[2]); */


    //datos organizacion
    entityReference += data[2] + ';';



    // Si es un recurso, miramos el tipo
    if (data && data.resourceType) {

      switch (data.resourceType) {

        // Si es un Bundle
        case FhirResourceType.BUNDLE:
          //const data = data as Bundle;

          if (data.entry && data.entry.length > 0) {

            // Extraemos el id del location de la respuesta
            data.entry.forEach((item: { response: { location: string; id: string; }; }) => {

              // Si el item es el paciente
              if (item.response?.location.split('/')[0] === FhirResourceType.PATIENT) {

                // Montamos su referencia con el identificador que tenga
                const entityRefPatient = patient.cipa;
                entityReference += entityRefPatient + ';'; // añadimos al entityReference global

              } else {
                entityReference += item.response.id + '/'
                  + item.response.location.split('/')[3] + ';'; // añadimos el id y version al entityReference global
              }
            });

            // Miramos si solo trae un recurso (en ese caso, hay que añadir también el paciente)
            if (data.entry.length === 1) {
              const entityRefPatient = patient.cipa;
              entityReference += entityRefPatient; // añadimos al entityReference global
            }

          }

          break;

        // Si es un OperationOutcome
        case FhirResourceType.OPERATION_OUTCOME:

          if (data.issue && data.issue.length > 0) {
            entityReference = data.issue[0].id.split('/')[1];  // seteamos el entityReference con el id

            // Añadimos también el paciente
            const entityRefPatient = patient.cipa;
            entityReference += entityRefPatient; // añadimos al entityReference global
          }

          break;
      }

      // Si es un array, iteramos y extraemos el id de cada recurso
    } else if (data && data instanceof Array && data.length > 0) {

      data.forEach(resource => {

        // Si el recurso es el paciente
        if (resource.resourceType && resource.resourceType === FhirResourceType.PATIENT) {

          // Montamos su referencia con el identificador que tenga
          const entityRefPatient = this.checkEntityPatientIdentifier(resource);
          entityReference += entityRefPatient + ';'; // añadimos al entityReference global

          // Si es otro recurso
        } else if (resource.resourceType && resource.resourceType === FhirResourceType.PRACTITIONER) {

          // Montamos su referencia con el identificador que tenga
          const entityRefPractitioner = this.checkEntityPractitionerIdentifier(resource);
          entityReference += entityRefPractitioner + ';';
        } else {
          let versionId = '';
          if (resource.hasOwnProperty('meta') && resource.meta.hasOwnProperty('versionId')) {
            versionId = resource.meta.versionId;
            entityReference += resource.id + '/' + versionId + ';'; // añadimos el id al entityReference global
          } else {
            entityReference += resource.id + ';'; // añadimos el id al entityReference global
          }
        }
      });

      // Si es un string, se iguala el entityReference al mismo
    } else if (typeof data === 'string') {
      entityReference = data;
    }

    return entityReference;
  }


  /**
   * Genera el JSON que se envia a ATNA para el registro en auditoría
   * @param entityReference
   * @param action acción por la que se audita
   * @param urlApi url api hdr
   */
  private generateJSONAudit(entityReference: any, action: any, urlApi: string): AuditEventAppRS {

    const event: AuditEventAppRS = {
      id : '',
      subtype: [],
      action: '',
      entityReference: '',
      entityQuery: '',
      resourceType: ''
    };

    event.id = AtnaRegistrationConstants.APP_SOURCE;
    event.action = action.action;
    event.entityReference = entityReference;
    event.entityQuery = urlApi;
    event.subtype = [];

    const type = this.codingResource;


    event.subtype.push(type);

    return event;
  }

  private get codingResource() {
    return <Coding>{
      code: this.profesionalService.secureEstablishment.code,
      display: this.profesionalService.secureEstablishment.centerName
    };
  }



  /**
   * Devuelve el valor correspondiente al identificador que tiene la entidad Paciente
   * @param patient
   */
  private checkEntityPatientIdentifier(patient: Patient): string {
    // Obtenemos un identifier del paciente por orden prioridad -> cipa/dni/prsid/passport
    const identifierPatient = this.getIdentifierPatient(patient);
    const versionPatient = this.getPatientVersionId(patient);
    let entityRefPatient = '';

    // Si ha encontrado identificador, miramos de qué tipo es
    if (identifierPatient) {

      if (identifierPatient.system === FhirPatient.CIPA_SYSTEM) {
        entityRefPatient = FhirResourceType.PATIENT
          + ':' + AtnaRegistrationConstants.IDENTIFIER_CIPA_PATIENT + ':' + identifierPatient.value;
      } else if (identifierPatient.system === FhirPatient.DNI_SYSTEM) {
        entityRefPatient = FhirResourceType.PATIENT
          + ':' + AtnaRegistrationConstants.IDENTIFIER_DNI_PATIENT + ':' + identifierPatient.value;
      } else if (identifierPatient.system === FhirPatient.PRSID_SYSTEM) {
        entityRefPatient = FhirResourceType.PATIENT
          + ':' + AtnaRegistrationConstants.IDENTIFIER_PRSID_PATIENT + ':' + identifierPatient.value;
      } else if (identifierPatient.system === FhirPatient.PASSPORT_SYSTEM) {
        entityRefPatient = FhirResourceType.PATIENT
          + ':' + AtnaRegistrationConstants.IDENTIFIER_PASSPORT_PATIENT + ':' + identifierPatient.value;
      }
    }
    if (entityRefPatient) {
      entityRefPatient = entityRefPatient + '/' + versionPatient;
    }
    return entityRefPatient;
  }



  /**
   * Devuelve el valor correspondiente al identificador que tiene la entidad Practitioner
   * @param practitioner
   */
  private checkEntityPractitionerIdentifier(practitioner: Practitioner): string {

    // Obtenemos un identifier del practitioner por orden prioridad -> dni/cias
    const identifierPractitioner = this.getIdentifierPractitioner(practitioner);
    // const identifierPractitionerValue = PractitionerUtil.getIdentifierPractitioner(practitioner).value;
    const versionPractitioner = this.getPractitionerVersionId(practitioner);



    let entityRefPractitioner = '';

    // Si ha encontrado identificador, miramos de qué tipo es
    if (identifierPractitioner) {

      if (identifierPractitioner.system === FhirPractitionerUrl.URL_PRACTITIONER_DNI) {
        entityRefPractitioner = FhirResourceType.PRACTITIONER
          + ':' + AtnaRegistrationConstants.IDENTIFIER_DNI_PRACTITIONER + ':' + identifierPractitioner.value;
      } else if (identifierPractitioner.system === FhirPractitionerUrl.URL_PRACTITIONER_CIAS) {
        entityRefPractitioner = FhirResourceType.PRACTITIONER
          + ':' + AtnaRegistrationConstants.IDENTIFIER_CIAS_PRACTITIONER + ':' + identifierPractitioner.value;
      }
    }
    if (entityRefPractitioner) {
      entityRefPractitioner = entityRefPractitioner + '/' + versionPractitioner;
    }

    return entityRefPractitioner;
  }

  //**********************UTILS PRACTITIONER********************************/

  /**
   * Método que nos devuelve el identificador del practitioner
   * @param practitioner
   */
  public getIdentifierPractitioner(practitioner: Practitioner): Identifier {

    let identifier: Identifier | any;
    // Si tenemos recurso
    if (practitioner) {
      // Miramos que tenga identifiers
      if (practitioner.identifier && practitioner.identifier.length > 0) {
        // Si tiene identifiers las recorremos
        const practitionerDNI = practitioner.identifier.find(item => item.system === FhirPractitionerUrl.URL_PRACTITIONER_DNI);
        const practitionerCIAS = practitioner.identifier.find(item => item.system === FhirPractitionerUrl.URL_PRACTITIONER_CIAS);
        if (practitionerDNI) {
          return practitionerDNI;
        } else if (practitionerCIAS) {
          return practitionerCIAS;
        }
      }
    }
    // Si no hemos encontrado la identifiers que buscamos devolvemos uno vacio
    return identifier;
  }
  /**
    * Devuelve la version del recurso
    * @param patient
    */
  public getPractitionerVersionId(practitioner: Practitioner) {
    if (practitioner && practitioner.meta) {
      if (practitioner.meta.versionId) {
        return practitioner.meta.versionId;
      }
    }
    return undefined;
  }


  //**********************UTILS PATIENT********************************/

  /**
      * Método que nos devuelve el identificador del paciente
      * @param patient
      */
  public getIdentifierPatient(patient: Patient): Identifier {


    let identifier: Identifier | any;
    // Si tenemos recurso
    if (patient) {
      // Miramos que tenga identifiers
      if (patient.identifier && patient.identifier.length > 0) {
        // Si tiene identifiers las recorremos
        let i = 0;
        while (i < patient.identifier.length) {
          // Si coincide la identifiers con la que buscamos, la devolvemos
          if (patient.identifier[i].system === FhirPatient.CIPA_SYSTEM) {
            return patient.identifier[i];
          }
          if (patient.identifier[i].system === FhirPatient.DNI_SYSTEM) {
            return patient.identifier[i];
          }
          if (patient.identifier[i].system === FhirPatient.PRSID_SYSTEM) {
            return patient.identifier[i];
          }
          if (patient.identifier[i].system === FhirPatient.PASSPORT_SYSTEM) {
            return patient.identifier[i];
          }
          i++;
        }
      }
    }
    // Si no hemos encontrado la identifiers que buscamos devolvemos un null
    return identifier;
  }

  /**
       * Devuelve la version del recurso
       * @param patient
       */
  public getPatientVersionId(patient: Patient) {
    if (patient && patient.meta) {
      if (patient.meta.versionId) {
        return patient.meta.versionId;
      }
    }
    return undefined;
  }

  //**********************************UTILS PROFESIONAL */

  get profesionalTypeDescription() {
    return this.constants.profesionalTypes.find(t => t.code === this.profesionalService.profesional.typeProfesional)?.description || '';
  }

  get firstProfesionalProvince() {
    return this.profesionalService.profesional.provinces.at(0)?.description || '';
  }

  get actualOrganizationCenter() {

    return this.profesionalService.center$.subscribe((data) => {

      this.defineOrganizationData(data);

    });
  }

  defineOrganizationData(data: any) {

    this.organizationName = data.centerName;
    this.organizationCode = data.code;
    this.organizationCIF = data.cif;
    //console.log('Se pasan datos de la organizacion: ', this.organizationName + '-' + this.organizationCode + '-' + this.organizationCIF);

  }

}

