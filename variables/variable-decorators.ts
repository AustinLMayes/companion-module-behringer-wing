import type { CompanionVariableDefinition, CompanionVariableValues, InstanceBase } from "@companion-module/base";

export function CompanionVariable(description: String) {
    return function (target: any, property: ClassFieldDecoratorContext) {
        if (property == undefined) {
            throw new Error("WingProperty decorator must be used on a member variable");
        }

        property.addInitializer(function (this: any) {
            if (this["__companion_variables"] == undefined) {
                this["__companion_variables"] = [];
            }

            this["__companion_variables"].push({ field: property.name, description: description });

            if (this["initCompanionVariables"] == undefined) {
                this["initCompanionVariables"] = function (this: any, variables: CompanionVariableDefinition[], values: CompanionVariableValues, descriptionBase: string = "") {
                    if (this["__companion_variables"] == undefined) {
                        return;
                    }
    
                    if (this["__jsonPath"] == undefined) {
                        throw new Error("Class must be a @WingObject and have completeJsonPath() called on it before initCompanionVariables() is called");
                    }
    
                    for (const variable of this["__companion_variables"]) {
                        var varId = this["__jsonPath"].replaceAll("/", "_") + "_" + variable.field;
                        if (varId.startsWith("_")) {
                            varId = varId.substring(1);
                        }
                        varId = varId.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                        if (typeof this[variable.field] != "object") {
                            if (variable.description == "") {
                                variable.description = variable.field;
                                variable.description = variable.description.charAt(0).toUpperCase() + variable.description.slice(1);
                            }
                            variables.push({
                                name: descriptionBase + variable.description,
                                variableId: varId
                            });
                            values[varId] = this[variable.field];
                        }
                        // Check if variable is an object and has initCompanionVariables
                        if (this[variable.field]["initCompanionVariables"] != undefined) {
                            var fullDesc = descriptionBase + variable.description + " ";
                            fullDesc = fullDesc.replace(/ +(?= )/g, '');
                            this[variable.field]["initCompanionVariables"](variables, values, fullDesc);
                        } else if (this[variable.field] instanceof Array) {
                            for (const element of this[variable.field]) {
                                if (element["initCompanionVariables"] != undefined) {
                                    var fullDesc = descriptionBase + variable.description + " " + element["_id"] + " ";
                                    fullDesc = fullDesc.replace(/ +(?= )/g, '');
                                    element["initCompanionVariables"](variables, values, fullDesc);
                                }
                            }
                        }
                    }
                }
            }
    
            if (this["updateCompanionVariables"] == undefined) {
                this["updateCompanionVariables"] = function (this: any, values: CompanionVariableValues) {
                    if (this["__companion_variables"] == undefined) {
                        return;
                    }
    
                    if (this["__jsonPath"] == undefined) {
                        throw new Error("Class must be a @WingObject and have completeJsonPath() called on it before initCompanionVariables() is called");
                    }
    
                    for (const variable of this["__companion_variables"]) {
                        // Only set if primitive type (string, number, boolean)
                        if (typeof this[variable.field] != "object") {
                            values[this["__jsonPath"].replaceAll("/", "_") + "_" + variable.field] = this[variable.field];
                        }
                        if (this[variable.field]["updateCompanionVariables"] != undefined) {
                            this[variable.field]["updateCompanionVariables"](values);
                        } else if (this[variable.field] instanceof Array) {
                            for (const element of this[variable.field]) {
                                if (element["updateCompanionVariables"] != undefined) {
                                    element["updateCompanionVariables"](values);
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}