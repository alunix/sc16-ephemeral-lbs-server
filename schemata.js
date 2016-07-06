exports.zone = {
    "type": "object",
    "properties": {
        "Geometry": {
            "type": "object",
            "properties": {
                "Type": {
                    "enum": ["Polygon"]
                },
                "Coordinates": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "number"
                        }
                    }

                }
            },
            "required": ["Type", "Coordinates"]

        },
        "Name": {
            "type": "string"
        },
        "Zone-id": {
            "type": "string"
        },
        "Expired-at": {
            "type": "string"
        },
        "Topics": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "uniqueItems": true
        }
    },
    "required": ["Geometry", "Name", "Zone-id", "Expired-at", "Topics"]
};

exports.messages = {
    "type": "object",
    "properties": {

        "Messages": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "Message-id": {
                        "type": "string"
                    },
                    "Zone-id": {
                        "type": "string"
                    },
                    "Created-at": {
                      "type": "string"
                    },
                    "Expired-at": {
                        "type": "string"
                    },
                    "Topic": {
                        "type": "string"
                    },
                    "Title": {
                        "type": "string"
                    },
                    "Message": {
                        "type": "string"
                    },
                    "Location": {
                        "type": ["object", "null"],
                        "properties": {

                            "Type": {
                                "enum": ["Point"]
                            },
                            "Coordinate": {
                                "type": "array",
                                "items": {
                                    "type": "number"
                                }
                            }
                        },
                        "required": ["Type", "Coordinate"]
                    }
                },
                "required": ["Message-id", "Zone-id", "Expired-at","Created-at", "Topic", "Title", "Message"]
            },
            "uniqueItems": true
        }
    },
    "required": ["Messages"]

};
