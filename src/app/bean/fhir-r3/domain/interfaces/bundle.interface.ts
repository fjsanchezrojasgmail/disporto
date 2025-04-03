import { BackboneElement, FhirResource, Identifier, Resource, Signature } from "./common.interface";

 export interface Bundle<BundleContentType = FhirResource> extends Resource {
    readonly resourceType: 'Bundle';
    entry?: BundleEntry<BundleContentType>[];
    identifier?: Identifier;
    link?: BundleLink[];
    signature?: Signature;
    total?: number;
    type: ('document'|'message'|'transaction'|'transaction-response'|'batch'|'batch-response'|'history'|'searchset'|'collection');
}
 export interface BundleEntry<BundleContentType = FhirResource> extends BackboneElement {
    fullUrl?: string;
    link?: BundleLink[];
    request?: BundleEntryRequest;
    resource?: BundleContentType;
    response?: BundleEntryResponse;
    search?: BundleEntrySearch;
}

export interface BundleLink extends BackboneElement {
    relation: string;
    url: string;
}

export interface BundleEntrySearch extends BackboneElement {
    mode?: ('match'|'include'|'outcome');
    score?: number;
}

export interface BundleEntryRequest extends BackboneElement {
    ifMatch?: string;
    ifModifiedSince?: string;
    ifNoneExist?: string;
    ifNoneMatch?: string;
    method: ('GET'|'POST'|'PUT'|'DELETE');
    url: string;
}

export interface BundleEntryResponse extends BackboneElement {
    etag?: string;
    lastModified?: string;
    location?: string;
    outcome?: FhirResource;
    status: string;
}