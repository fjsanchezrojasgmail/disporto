import { Bundle, RequestGroup } from "fhir/r3";


export const bundleRequestGroup: Bundle<RequestGroup> ={
  "resourceType": "Bundle",
  "id": "47863236-1735-4590-88ec-6c8c46da0270",
  "meta": {
    "lastUpdated": "2025-04-16T10:29:37.217+00:00",
    "tag": [ {
      "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
      "code": "SUBSETTED",
      "display": "Resource encoded in summary mode"
    } ]
  },
  "type": "searchset",
  "link": [ {
    "relation": "self",
    "url": "https://hapi.fhir.org/baseR4/RequestGroup?_format=json&_pretty=true&_summary=data"
  }, {
    "relation": "next",
    "url": "https://hapi.fhir.org/baseR4?_getpages=47863236-1735-4590-88ec-6c8c46da0270&_getpagesoffset=20&_count=20&_format=json&_pretty=true&_bundletype=searchset"
  } ],
  "entry": [ {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/206820",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "206820",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T05:48:21.823+00:00",

        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/215850",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "215850",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T06:59:36.169+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept": {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/215950",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "215950",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:01:22.126+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216025",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216025",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:03:33.205+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept": {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216111",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216111",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:05:37.441+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216224",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216224",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:08:03.213+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {
              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216688",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216688",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:22:23.955+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216748",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216748",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:24:41.117+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216808",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216808",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:27:52.629+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216917",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216917",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:31:22.588+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/216972",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "216972",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:33:35.890+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217027",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217027",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:36:25.751+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217109",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217109",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:39:20.539+00:00",
         "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217164",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217164",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:41:01.046+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217220",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217220",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:42:21.742+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217276",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217276",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:43:33.575+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217332",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217332",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:44:49.348+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217388",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217388",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:45:54.889+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217443",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217443",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:47:40.832+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  }, {
    "fullUrl": "https://hapi.fhir.org/baseR4/RequestGroup/217499",
    "resource": {
      "resourceType": "RequestGroup",
      "id": "217499",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2019-12-05T07:50:40.297+00:00",
        "tag": [ {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
          "code": "SUBSETTED",
          "display": "Resource encoded in summary mode"
        } ]
      },
      "identifier": [ {
        "value": "requestgroup-1"
      } ],
      "groupIdentifier": {
        "system": "http://example.org/treatment-group",
        "value": "00001"
      },
      "status": "draft",
      "intent": "plan",
      "priority": "routine",
      "reasonCodeableConcept":  {
        "text": "Treatment"
      } ,
      "note": [ {
        "text": "Additional notes about the request group"
      } ],
      "action": [ {
        "id": "1",
        "title": "Administer Medications",
        "description": "Administer medications at the appropriate time",
        "textEquivalent": "Administer medication 1, followed an hour later by medication 2",
        "timingDateTime": "2017-03-06T19:00:00Z",
        "groupingBehavior": "logical-group",
        "selectionBehavior": "all",
        "requiredBehavior": "must",
        "precheckBehavior": "yes",
        "cardinalityBehavior": "single",
        "action": [ {
          "id": "medication-action-1",
          "description": "Administer medication 1",
          "type": {

              "code": "create"

          }
        }, {
          "id": "medication-action-2",
          "description": "Administer medication 2",
          "relatedAction": [ {
            "actionId": "medication-action-1",
            "relationship": "after-end",
            "offsetDuration": {
              "value": 1,
              "unit": "h"
            }
          } ],
          "type": {

              "code": "create"

          }
        } ]
      } ]
    },
    "search": {
      "mode": "match"
    }
  } ]
}

