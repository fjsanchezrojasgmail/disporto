import { Bundle, Device } from "fhir/r3";

export const device_mock: Bundle<Device> =

{
  "resourceType": "Bundle",
  "id": "814c7643-f4ac-49e9-abb8-739a9b4b0069",
  "meta": {
    "lastUpdated": "2025-04-17T10:27:09.201+00:00",
    "tag": [ {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
      "code": "SUBSETTED",
      "display": "Resource encoded in summary mode"
    } ]
  },
  "type": "searchset",
  "link": [ {
    "relation": "self",
    "url": "https://hapi.fhir.org/baseR4/Device?_format=json&_include=*&_include=Device%3Alocation&_include=Device%3Aorganization&_include=Device%3Apatient&_pretty=true&_summary=data"
  }, {
    "relation": "next",
    "url": "https://hapi.fhir.org/baseR4?_getpages=814c7643-f4ac-49e9-abb8-739a9b4b0069&_getpagesoffset=20&_count=20&_format=json&_pretty=true&_include=Device%3Alocation&_include=Device%3Aorganization&_include=Device%3Apatient&_include=*&_bundletype=searchset"
  } ],
  "entry": [ {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/234",
    "resource": {
      "resourceType": "Device",
      "id": "234",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-17T22:21:48.201+00:00",

        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "00868475000235-26fedc67-c594-4625-bac5-f90ce044074d"
      } ],
      "patient": {
        "reference": "Patient/233"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/769",
    "resource": {
      "resourceType": "Device",
      "id": "769",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-18T20:25:09.710+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "00868475000235-4c40353b-9214-478b-aa0f-919010499a51"
      } ],
      "patient": {
        "reference": "Patient/768"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1116",
    "resource": {
      "resourceType": "Device",
      "id": "1116",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-19T11:52:47.361+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:ae2742fb-82f4-5b08-8369-3364c1edcc50"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1119",
    "resource": {
      "resourceType": "Device",
      "id": "1119",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-19T11:59:30.673+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:ae2742fb-82f4-5b08-8369-3364c1edcc50"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1120",
    "resource": {
      "resourceType": "Device",
      "id": "1120",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-19T12:00:18.688+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:ae2742fb-82f4-5b08-8369-3364c1edcc50"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1121",
    "resource": {
      "resourceType": "Device",
      "id": "1121",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-19T12:00:42.009+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:ae2742fb-82f4-5b08-8369-3364c1edcc50"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1125",
    "resource": {
      "resourceType": "Device",
      "id": "1125",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-19T12:18:28.466+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:08764381-a74e-5b0e-9f18-3537a15b37ed"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1149",
    "resource": {
      "resourceType": "Device",
      "id": "1149",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-19T13:13:16.572+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:43b944f2-2d1e-51e5-8096-bfcb100215da"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1191",
    "resource": {
      "resourceType": "Device",
      "id": "1191",
      "meta": {
        "versionId": "5",
        "lastUpdated": "2019-09-19T14:15:56.764+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:0a299fb9-1802-5e55-b4c0-1ede08a21aa0"
      } ],
      "patient": {
        "reference": "Device/1150"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1192",
    "resource": {
      "resourceType": "Device",
      "id": "1192",
      "meta": {
        "versionId": "5",
        "lastUpdated": "2019-09-19T14:15:56.882+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:3939dbe0-e045-5304-b3b1-4194ddea7a17"
      } ],
      "patient": {
        "reference": "Device/1150"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1150",
    "resource": {
      "resourceType": "Device",
      "id": "1150",
      "meta": {
        "versionId": "5",
        "lastUpdated": "2019-09-19T16:24:47.616+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:43b944f2-2d1e-51e5-8096-bfcb100215da"
      } ],
      "type": {
        "coding": [ {
          "system": "urn:oid:1.2.840.10004.1.1.1.0.0.1",
          "code": "69641"
        } ]
      },
      "location": {
        "reference": "Location/1224"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1204",
    "resource": {
      "resourceType": "Device",
      "id": "1204",
      "meta": {
        "versionId": "3",
        "lastUpdated": "2019-09-19T16:30:27.786+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:0edcf3d9-5de0-585e-8caf-306d6c785734"
      } ],
      "type": {
        "coding": [ {
          "system": "urn:oid:1.2.840.10004.1.1.1.0.0.1",
          "code": "69642"
        } ]
      },
      "patient": {
        "reference": "Device/1150"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1205",
    "resource": {
      "resourceType": "Device",
      "id": "1205",
      "meta": {
        "versionId": "3",
        "lastUpdated": "2019-09-19T16:30:27.898+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:dcd81b46-d8f4-5610-b9de-df8d527874a8"
      } ],
      "type": {
        "coding": [ {
          "system": "urn:oid:1.3.6.1.4.1.3592.2.1.1.0",
          "code": "DN_VMD"
        } ]
      },
      "patient": {
        "reference": "Device/1150"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1231",
    "resource": {
      "resourceType": "Device",
      "id": "1231",
      "meta": {
        "versionId": "2",
        "lastUpdated": "2019-09-19T18:26:13.680+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:c5d9a5a1-fc98-50cf-9875-913b79536cbb"
      } ],
      "type": {
        "coding": [ {
          "system": "urn:oid:1.2.840.10004.1.1.1.0.0.1",
          "code": "69643"
        } ]
      },
      "patient": {
        "reference": "Device/1204"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1232",
    "resource": {
      "resourceType": "Device",
      "id": "1232",
      "meta": {
        "versionId": "2",
        "lastUpdated": "2019-09-19T18:26:19.680+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "urn:uuid:4a46ebc1-5483-543d-9406-5dd70c994090"
      } ],
      "type": {
        "coding": [ {
          "system": "urn:oid:1.3.6.1.4.1.3592.2.1.1.0",
          "code": "DN_CHAN"
        } ]
      },
      "patient": {
        "reference": "Device/1205"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/1655",
    "resource": {
      "resourceType": "Device",
      "id": "1655",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-20T15:06:55.412+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "00868475000235-364c446e-704d-42e9-b6e7-59408e14b886"
      } ],
      "patient": {
        "reference": "Patient/1654"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/30244",
    "resource": {
      "resourceType": "Device",
      "id": "30244",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-26T14:42:56.697+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "manufacturer": "manufacturer-name",
      "identifier": [ {
        "value": "Raspberry Pi",
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/30330",
    "resource": {
      "resourceType": "Device",
      "id": "30330",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-26T16:30:51.650+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "manufacturer": "manufacturer-name",
      "identifier": [ {
        "value": "Raspberry Pi",
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/30331",
    "resource": {
      "resourceType": "Device",
      "id": "30331",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-26T16:32:31.795+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "manufacturer": "manufacturer-name",
      "identifier": [ {
        "value": "Raspberry Pi",
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Device/30333",
    "resource": {
      "resourceType": "Device",
      "id": "30333",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-09-26T16:33:57.444+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "manufacturer": "manufacturer-name",
      "identifier": [ {
        "value": "Raspberry Pi",
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/Patient/768",
    "resource": {
      "resourceType": "Device",
      "id": "768",
      "meta": {
        "versionId": "3",
        "lastUpdated": "2021-10-14T04:49:55.793+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "use": "usual",
        "value": "768",
        "assigner": {
          "display": "KORE"
        }
      } ]
    },
    "search": {
      "mode": "include"
    }
  } ]
}

