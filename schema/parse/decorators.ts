import { parse } from "./adapter_registry.js";

export function WingProperty(jsonPath: string, resType: any, maxArrayLength: number = 0, keyFilter: (key: string) => boolean = (key: string) => true) {
    return function (target: any, property: ClassFieldDecoratorContext) {
        if (property == undefined) {
            throw new Error("WingProperty decorator must be used on a member variable");
        }

        const propertyKey = property.name as string;

        property.addInitializer(function (this: any) {
            const parseMethodName = `parse${propertyKey.charAt(0).toUpperCase()}${propertyKey.slice(1)}`;
        
            // Add map of top level keys to object
            if (this["__deserialized_keys"] == undefined) {
                this["__deserialized_keys"] = {};
            }
            const top = jsonPath.split("/")[0];
            if (this["__deserialized_keys"][top] == undefined) {
                this["__deserialized_keys"][top] = [];
            }
            this["__deserialized_keys"][top].push({ key: propertyKey, jsonPath: jsonPath, parseMethodName: parseMethodName});

            this[parseMethodName] = function (data: any) {
                // See if JSONPath exists in the value
                var split = jsonPath.split("/");
                var res = null;
                try {
                    var found = true;
                    for (var i = 0; i < split.length; i++) {
                        data = data[split[i]];
                        if (data == undefined) {
                            found = false;
                        }
                    }
                    if (maxArrayLength > 0) {
                        if (this[propertyKey] == undefined) {
                            this[propertyKey] = [];
                            for (var j = 0; j < maxArrayLength; j++) {
                                this[propertyKey].push(new resType());
                            }
                        }
                    }
                    if (found) {
                        if (maxArrayLength > 0) {
                            var array = [];
                            var i = 0;
                            for (var key in data) {
                                if (keyFilter(key)) {
                                    if (maxArrayLength > 0 && i > maxArrayLength) {
                                        throw new Error("Array length exceeds max length of " + maxArrayLength + " for property " + propertyKey + ". It has " + i + " elements");
                                    }
                                    i++;
                                    var element = data[key];
                                    if (element != null) {
                                        // If element is an object, add _id property
                                        if (element instanceof Object) {
                                            element._id = key;
                                        } else {
                                            throw new Error("Array element is not an object for property " + propertyKey + ". It is of type " + typeof element + " with value " + element);
                                        }
                                    }
                                    array.push(element);
                                }
                            }
                            res = this[propertyKey];
                            // Parse each element
                            for (var i = 0; i < array.length; i++) {
                                var element = array[i];
                                if (element != null) {
                                    var parsed = parse(resType, element, this[propertyKey][i]) as any;
                                    if (parsed == null || parsed == undefined) {
                                        throw new Error("Error parsing array element " + i + " for property " + propertyKey + ": " + element + " is not of type " + resType.name);
                                    }
                                    parsed._id = element._id;
                                    res[i] = parsed;
                                }
                            }
                        } else if (resType.name != "Object") {
                            res = parse(resType, data, this[propertyKey]) as any;
                        } else {
                            throw new Error("Cannot parse object of type " + resType.name);
                        }
                        if (res == null) {
                            throw new Error("Error parsing property " + propertyKey + ": " + data + " is not of type " + resType.name);
                        }
                        this[propertyKey] = res;
                    } else {
                        // console.log("Property " + propertyKey + " not found for " + this.constructor.name);
                    }
                } catch (e) {
                    throw new Error("Error parsing property " + propertyKey + ": " + e.message);
                }
            };
        });
    };
}

// Adds a parse() method to the class - can only be used on classes
export function WingObject(target: any, property?: ClassDecoratorContext) {
    if (target.prototype.parse != undefined) {
        throw new Error("Class " + target.name + " already has a parse() method");
    }
    Object.defineProperty(target.prototype, "parse", {
        value: function (this: any, data: any) {
            // Add map of top level keys to object
            if (this["__deserialized_keys"] == undefined) {
                this["__deserialized_keys"] = {};
            }
            // Parse each property
            for (var key in this.__deserialized_keys) {
                var properties = this.__deserialized_keys[key];
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    this[property.parseMethodName](data);
                }
            }
            return this;
        }
    });

    Object.defineProperty(target.prototype, "__jsonPath", {
        value: "",
        writable: true
    });

    Object.defineProperty(target.prototype, "completeJsonPath", {
        value: function (this: any) {
            // Add map of top level keys to object
            if (this["__deserialized_keys"] == undefined) {
                this["__deserialized_keys"] = {};
            }
            var thisPath = this["__jsonPath"] == undefined ? "" : this["__jsonPath"];
            // Parse each property
            for (var key in this.__deserialized_keys) {
                var properties = this.__deserialized_keys[key];
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    var fullPath = thisPath + "/" + property.jsonPath;
                    if (this[property.key] instanceof Array) {
                        for (var j = 0; j < this[property.key].length; j++) {
                            var element = this[property.key][j];
                            if (element != null && element instanceof Object && element.__jsonPath != undefined) {
                                element["__jsonPath"] = fullPath + "/" + element._id;
                                if (element.completeJsonPath != undefined) {
                                    element.completeJsonPath();
                                }
                            }
                        }
                    } else if (this[property.key] instanceof Object && this[property.key].__jsonPath != undefined) {
                        this[property.key]["__jsonPath"] = fullPath;
                        if (this[property.key].completeJsonPath != undefined) {
                            this[property.key].completeJsonPath();
                        }
                    }
                }
            }
            return this;
        }
    });

    // Add getJsonPath(field: string) method
    Object.defineProperty(target.prototype, "getJsonPath", {
        value: function (this: any, field: string) {
            // Add map of top level keys to object
            if (this["__deserialized_keys"] == undefined) {
                this["__deserialized_keys"] = {};
            }
            // Parse each property
            for (var key in this.__deserialized_keys) {
                var properties = this.__deserialized_keys[key];
                for (var i = 0; i < properties.length; i++) {
                    var property = properties[i];
                    if (property.key == field) {
                        return this["__jsonPath"] + "/" + property.jsonPath;
                    }
                }
            }
            throw new Error("Field " + field + " not found");
        }
    });
}