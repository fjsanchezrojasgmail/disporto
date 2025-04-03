export interface ConfigProperties {
  hostUrl: string;
  hostUrlHnanexo: string;
  hostUrlLocal: string;
  urlDisportoreq: string;
  urlAnexoreq:string;
  urlEncrytion: boolean;
  noEncodeKeys: string[];
  encrytionKey: string;
  messageLife: number;
}

export const initialConfigProperties: ConfigProperties = {
  //hostUrl: 'http://localhost:8080/disporto', //'http://ortosacyl.indra.es/disporto',
  hostUrl: 'http://ortosacyl.indra.es/disporto',
  hostUrlHnanexo: 'http://localhost:8080/hnanexo', //'http://ortosacyl.indra.es/hnanexo',
  hostUrlLocal: 'http://localhost:8080/disporto', //localhost
  urlDisportoreq: 'http://ortosacyl.indra.es/disporto/api/hdr',
  urlAnexoreq: 'http://ortosacyl.indra.es/hnanexo/api/hdr',
  urlEncrytion: false,
  noEncodeKeys: ['page'],
  encrytionKey: 'ANEX067891234567',
  messageLife: 3000
};