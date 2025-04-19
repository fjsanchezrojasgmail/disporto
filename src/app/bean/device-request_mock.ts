import { Bundle, DeviceRequest } from "fhir/r3";

export const device_request_mock: Bundle<DeviceRequest> =

{
  "resourceType": "Bundle",
  "id": "ff993143-a9c1-40de-8ced-2dbdc5a6c185",
  "meta": {
    "lastUpdated": "2025-04-17T10:43:27.067+00:00",
    "tag": [ {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
      "code": "SUBSETTED",
      "display": "Resource encoded in summary mode"
    } ]
  },
  "type": "searchset",
  "link": [ {
    "relation": "self",
    "url": "https://hapi.fhir.org/baseR4/DeviceRequest?_format=json&_include=*&_include=DeviceRequest%3Abased-on&_include=DeviceRequest%3Adevice&_include=DeviceRequest%3Aencounter&_include=DeviceRequest%3Ainstantiates-canonical&_include=DeviceRequest%3Ainsurance&_include=DeviceRequest%3Apatient&_include=DeviceRequest%3Aperformer&_include=DeviceRequest%3Aprior-request&_include=DeviceRequest%3Arequester&_include=DeviceRequest%3Asubject&_pretty=true&_summary=data"
  }, {
    "relation": "next",
    "url": "https://hapi.fhir.org/baseR4?_getpages=ff993143-a9c1-40de-8ced-2dbdc5a6c185&_getpagesoffset=20&_count=20&_format=json&_pretty=true&_include=DeviceRequest%3Aencounter&_include=DeviceRequest%3Ainstantiates-canonical&_include=*&_include=DeviceRequest%3Abased-on&_include=DeviceRequest%3Aprior-request&_include=DeviceRequest%3Arequester&_include=DeviceRequest%3Aperformer&_include=DeviceRequest%3Asubject&_include=DeviceRequest%3Adevice&_include=DeviceRequest%3Apatient&_include=DeviceRequest%3Ainsurance&_bundletype=searchset"
  } ],
  "entry": [ {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/206731",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "206731",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T05:48:03.804+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "status": "completed",
      "intent": {
       "text": "original-order"
      },
      "subject": {
        "reference": "Patient/206686"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/624717",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "624717",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2020-02-18T22:49:30.327+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "system": "http://www.happysight.com/prescription",
        "value": "15013R"
      } ],
      "groupIdentifier": {
        "system": "http://acme.org",
        "value": "15013"
      },
      "status": "completed",
      "intent": {
       "text": "original-order"
      },
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://terminology.hl7.org/CodeSystem/ex-visionprescriptionproduct",
          "code": "lens"
        } ]
      },"context": {
        "display": "Encounter",
        "identifier": {
          "system": "ORBIS",
          "value": "E-5454555"
        }
      },
      "reasonCode": [ {

          "coding": [ {
            "system": "http://loinc.org",
            "code": "28826-6",
            "display": "Sphere distance Glasses prescription.lens - right"
          } ],
          "text": "sphere, right lens"
        ,
        "extension": [{
          "valueInteger": 2.0,
          "valueId": "Diopter",
          "url": "http://unitsofmeasure.org",
          "valueCode": "[diop]"
        }]
      }, {

          "coding": [ {
            "system": "http://loinc.org",
            "code": "28829-0",
            "display": "Prism base distance Glasses prescription.lens - right"
          } ],
          "text": "prisms, right lens"
        ,
        "extension": [{
          "valueInteger": 2.0,
          "valueId": "Diopter",
          "url": "http://unitsofmeasure.org",
          "valueCode": "[diop]"
        }]
      }, {

          "coding": [ {
            "system": "http://loinc.org",
            "code": "28810-0",
            "display": "Add 1 LM glasses lens - right"
          } ],
          "text": "add, right lens"
        ,
        "extension": [{
          "valueInteger": 2.0,
          "valueId": "Diopter",
          "url": "http://unitsofmeasure.org",
          "valueCode": "[diop]"
        }]
      } ],
      "subject": {
        "reference": "Patient/example"
      },
      "occurrenceDateTime": "2014-06-15",
      "requester": {
        "agent": {
          "display": "Practitioner/80198"
        }
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/1181880",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "1181880",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2020-06-03T22:21:22.523+00:00",

        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "status": "active",
      "intent": {
        "text": "plan"
      },
      "subject": {
        "id": "Patient",
        "identifier": {
          "system": "ORBIS",
          "value": "P-458748456"
        }
      },
      "context": {
        "display": "Encounter",
        "identifier": {
          "system": "ORBIS",
          "value": "E-5454555"
        }
      },
      "occurrenceDateTime": "2020-06-02T15:45:00+10:00",
      "supportingInfo": [ {
        "id": "Procedure",
        "identifier": {
          "system": "ORBIS",
          "value": "O-345952"
        }
      }, {
        "id": "Organization",
        "identifier": {
          "system": "ORBIS",
          "value": "Fac001"
        }
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/DR-3658944",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "DR-3658944",
      "meta": {
        "versionId": "2",
        "lastUpdated": "2020-06-05T08:40:23.306+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "status": "active",
      "intent": {
       "text": "plan"
      },
      "extension": [ {
        "url": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
        "valueQuantity": {
          "value": 1
        }
      } ],
      "subject": {
        "display": "Patient",
        "identifier": {
          "system": "ORBIS",
          "value": "P-458748456"
        }
      },
      "context": {
        "display": "Encounter",
        "identifier": {
          "system": "ORBIS",
          "value": "E-5454555"
        }
      },
      "occurrenceDateTime": "2020-06-02T15:45:00+10:00",
      "supportingInfo": [ {
        "display": "Procedure",
        "identifier": {
          "system": "ORBIS",
          "value": "O-345952"
        }
      }, {
        "display": "Organization",
        "identifier": {
          "system": "ORBIS",
          "value": "Fac001"
        }
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/1723173",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "1723173",
      "meta": {
        "versionId": "2",
        "lastUpdated": "2021-01-04T19:40:43.488+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "ip_request2"
      } ],
      "basedOn": [ {
        "display": "Homecare - DM follow-up"
      } ],
      "priorRequest": [ {
        "display": "CGM ambulatory"
      } ],
      "groupIdentifier": {
        "value": "ip_request1"
      },
      "status": "active",
      "intent": {

        "text": "order"
      },
      "priority": "routine",
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://www.ama-assn.org/go/cpt",
          "code": "E1392"
        } ],
        "text": "Portable Oxygen Concentrator, Rental"
      },
      "subject": {
        "reference": "Patient/1723168"
      },

      "context": {
        "display": "Encounter",
        "identifier": {
          "system": "Ambulatory",
          "value": "E-5454555"
        }
      },
      "occurrenceDateTime": "2020-08-05T09:33:27+07:00",
      "authoredOn": "2020-08-05T09:33:27+07:00",
      "requester": {
        "agent": {
          "id": "Practitioner/1723167",
        "display": "Dr.Ronald Bone"
      }
    },
      "reasonCode": [ {
        "text": "COPD"
      } ],
      "reasonReference": [ {
        "display": "COPD"
      } ],
      "supportingInfo": [ {
        "reference": "Observation/1723172",
        "display": "Previous results"
      } ],
      "note": [ {
        "text": "patient is mobile -- needs portable O2 concentrator"
      } ],
      "relevantHistory": [ {
        "display": "Request for specific device"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2139156",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2139156",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2021-05-26T08:53:55.916+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "status": "draft",
      "intent": {
       "text": "plan"
      },
      "priority": "routine",
      "codeReference": {
        "reference": "Device/2139150"
      },
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://deviceRequestCode.in",
          "version": "1.0",
          "code": "DeviceRequestCode",
          "display": "DeviceCodeDisplay",
          "userSelected": false
        } ],
        "text": "Portable Oxygen Concentrator, Rental"
      }
      ,
      "subject": {
        "reference": "Patient/2135929"
      },
      "performerType": {
        "id": "375005",
        "coding": [ {
          "system": "http://snomed.info/sct",
          "code": "375005",
          "display": "Sibling"
        } ],
        "text": "sibling"
      },
      "reasonCode": [ {
        "id": "109006",
        "coding": [ {
          "system": "http://snomed.info/sct",
          "code": "109006",
          "display": "Anxiety disorder of childhood OR adolescence"
        } ],
        "text": "Anxiety disorder of childhood OR adolescence"
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2657497",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2657497",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2021-10-28T17:20:19.733+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "plan"
      },
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802029",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802029",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:55.839+00:00",
        "security": [ {
          "system": "http://example.com/Coding-0",
          "code": "Coding-193"
        } ],
        "tag": [ {
          "system": "http://example.com/Coding-0",
          "code": "Coding-194"
        }, {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "use": "temp",
        "system": "http://example.com/Identifier-0",
        "value": "Identifier-66"
      } ],
      "groupIdentifier": {
        "use": "temp",
        "system": "http://example.com/Identifier-0",
        "value": "Identifier-65"
      },
      "status": "active",
     "intent": {
        "text": "plan"
      },
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802030",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802030",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:56.177+00:00",
        "security": [ {
          "system": "http://example.com/Coding-1",
          "code": "Coding-195"
        } ],
        "tag": [ {
          "system": "http://example.com/Coding-1",
          "code": "Coding-196"
        }, {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "use": "temp",
        "system": "http://example.com/Identifier-1",
        "value": "Identifier-68"
      } ],
      "groupIdentifier": {
        "use": "temp",
        "system": "http://example.com/Identifier-1",
        "value": "Identifier-67"
      },
      "status": "suspended",
      "intent": {
        "text": "directive"
      },
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802031",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802031",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:56.617+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      },
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://example.com/CodeableConcept-0",
          "code": "CodeableConcept-141"
        } ]
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802032",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802032",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:57.049+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
     "intent": {
        "text": "option"
      },
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://example.com/CodeableConcept-1",
          "code": "CodeableConcept-142"
        } ]
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802033",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802033",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:57.318+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802034",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802034",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:57.631+00:00",

        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802035",
    "resource": {
      "resourceType": "DeviceRequest",
      "subject": {
        "display": "Integrity",
      },
      "id": "2802035",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:57.857+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2802036",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2802036",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-27T09:49:58.149+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2803404",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2803404",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-28T03:08:47.391+00:00",
        "security": [ {
          "system": "http://example.com/Coding-0",
          "code": "Coding-193"
        } ],
        "tag": [ {
          "system": "http://example.com/Coding-0",
          "code": "Coding-194"
        }, {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "use": "temp",
        "system": "http://example.com/Identifier-0",
        "value": "Identifier-66"
      } ],
      "groupIdentifier": {
        "use": "temp",
        "system": "http://example.com/Identifier-0",
        "value": "Identifier-65"
      },
      "status": "active",
      "intent": {
        "text": "plan"
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2803405",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2803405",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-28T03:08:47.881+00:00",
        "security": [ {
          "system": "http://example.com/Coding-1",
          "code": "Coding-195"
        } ],
        "tag": [ {
          "system": "http://example.com/Coding-1",
          "code": "Coding-196"
        }, {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "use": "temp",
        "system": "http://example.com/Identifier-1",
        "value": "Identifier-68"
      } ],
      "groupIdentifier": {
        "use": "temp",
        "system": "http://example.com/Identifier-1",
        "value": "Identifier-67"
      },
      "status": "suspended",
      "intent": {
        "text": "directive"
      },
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2803406",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2803406",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-28T03:08:48.166+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      },
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://example.com/CodeableConcept-0",
          "code": "CodeableConcept-141"
        } ]
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2803407",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2803407",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-28T03:08:48.439+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      },
      "codeCodeableConcept": {
        "coding": [ {
          "system": "http://example.com/CodeableConcept-1",
          "code": "CodeableConcept-142"
        } ]
      }
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/DeviceRequest/2803408",
    "resource": {
      "resourceType": "DeviceRequest",
      "id": "2803408",
      "subject": {
        "display": "Integrity",
      },
      "meta": {
        "versionId": "1",
        "lastUpdated": "2022-01-28T03:08:48.744+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "intent": {
        "text": "option"
      }
  }

  }]
}

