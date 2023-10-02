import { combineRgb, type CompanionActionDefinitions, type CompanionActionEvent, type CompanionBooleanFeedbackDefinition, type CompanionFeedbackDefinitions, type CompanionInputFieldDropdown, type CompanionVariableDefinition, type CompanionVariableValues, type InstanceBase, type SomeCompanionActionInputField, type SomeCompanionFeedbackInputField } from "@companion-module/base";

export interface UserFacingObject {
    describe(): string;
}

class TargetData {
    description: string;
    target: any;
}

class ActionData {
    fieldName: string;
    description: string;
    optionData: SomeCompanionActionInputField;
    targetChoices: Map<string, TargetData>;

    createSelectType(): SomeCompanionActionInputField | undefined {
        if (this.targetChoices.size == 1) {
            return undefined; // No need to select if only one choice
        } else {
            return {
                type: "dropdown",
                id: "target",
                label: "Target",
                choices: Array.from(this.targetChoices.values()).map((value) => {
                    return {
                        id: value.target["__jsonPath"],
                        label: value.description
                    }
                }),
                default: Array.from(this.targetChoices.values())[0].target["__jsonPath"]
            };
        }
    }
}

const actionsById: Map<string, ActionData> = new Map();

function registerAction(id: string, fieldName: string, description: string, optionData: SomeCompanionActionInputField, target: TargetData) {
    if (target.target["__jsonPath"] == undefined) {
        throw new Error("Class must be a @WingObject and have completeJsonPath() called on it before initCompanionData() is called");
    }
    if (actionsById.has(id)) {
        actionsById.get(id).targetChoices.set(target.target["__jsonPath"], target);
    }
    else {
        var data = new ActionData();
        data.fieldName = fieldName;
        data.description = description;
        data.optionData = optionData;
        data.targetChoices = new Map();
        data.targetChoices.set(target.target["__jsonPath"], target);
        actionsById.set(id, data);
    }
}

class FeedbackData {
    fieldName: string;
    description: string;
    targetChoices: Map<string, TargetData>;

    createSelectType(): SomeCompanionFeedbackInputField | undefined {
        if (this.targetChoices.size == 1) {
            return undefined; // No need to select if only one choice
        } else {
            return {
                type: "dropdown",
                id: "target",
                label: "Target",
                choices: Array.from(this.targetChoices.values()).map((value) => {
                    return {
                        id: value.target["__jsonPath"],
                        label: value.description
                    }
                }),
                default: Array.from(this.targetChoices.values())[0].target["__jsonPath"]
            };
        }
    }
}

const feedbacksById: Map<string, FeedbackData> = new Map();

function registerFeedback(id: string, fieldName: string, description: string, target: TargetData) {
    if (target.target["__jsonPath"] == undefined) {
        throw new Error("Class must be a @WingObject and have completeJsonPath() called on it before initCompanionData() is called");
    }
    if (feedbacksById.has(id)) {
        feedbacksById.get(id).targetChoices.set(target.target["__jsonPath"], target);
    }
    else {
        var data = new FeedbackData();
        data.fieldName = fieldName;
        data.description = description;
        data.targetChoices = new Map();
        data.targetChoices.set(target.target["__jsonPath"], target);
        feedbacksById.set(id, data);
    }
}

export function ExposedValue(description: String, selectType: any = undefined, relative: boolean = false, fade: boolean = true) {
    return function (target: any, property: ClassFieldDecoratorContext) {
        if (property == undefined) {
            throw new Error("WingProperty decorator must be used on a member variable");
        }

        property.addInitializer(function (this: any) {
            // Ensure this is a UserFacingObject
            if (!(typeof this.describe == "function")) {
                throw new Error("Class " + this.constructor.name + " must implement UserFacingObject");
            }

            if (this["__companion_data"] == undefined) {
                this["__companion_data"] = [];
            }

            this["__companion_data"].push({ field: property.name, description: description, selectType: selectType, relative: relative });

            if (this["initCompanionData"] == undefined) {
                this["initCompanionData"] = function (this: any, variables: CompanionVariableDefinition[], values: CompanionVariableValues, descriptionBase: string = "") {
                    if (this["__companion_data"] == undefined) {
                        return;
                    }
    
                    if (this["__jsonPath"] == undefined) {
                        throw new Error("Class must be a @WingObject and have completeJsonPath() called on it before initCompanionData() is called");
                    }
    
                    for (const variable of this["__companion_data"]) {
                        var varId = this["__jsonPath"].replaceAll("/", "_") + "_" + variable.field;
                        if (varId.startsWith("_")) {
                            varId = varId.substring(1);
                        }
                        varId = varId.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                        if (typeof this[variable.field] == undefined) {
                            throw new Error("Variable " + variable.field + " is undefined");
                        }

                        if (typeof this[variable.field] != "object" || variable.selectType != undefined) {
                            if (variable.description == "") {
                                variable.description = variable.field;
                                variable.description = variable.description.charAt(0).toUpperCase() + variable.description.slice(1);
                            }
                            var selectTypeObj = variable.selectType;
                            if (selectTypeObj == undefined) {
                                selectTypeObj = determineSelectType(this[variable.field].constructor);
                            }
                            if (selectTypeObj == undefined) {
                                throw new Error("Unable to determine select type for " + variable.field);
                            }
                            if (variable.relative && typeof this[variable.field] != "number") {
                                throw new Error("Relative variable " + variable.field + " must be a number");
                            }
                            variables.push({
                                name: descriptionBase + variable.description,
                                variableId: varId
                            });
                            selectTypeObj = {
                                ...selectTypeObj
                            }
                            if (variable.min != undefined) {
                                selectTypeObj["min"] = variable.min;
                            }
                            if (variable.max != undefined) {
                                selectTypeObj["max"] = variable.max;
                            }
                            var verb = "Set ";
                            if (typeof this[variable.field] == "boolean") {
                                verb = "Toggle ";
                            }
                            var friendlyThis = this.constructor.name;
                            // Convert to space separated words
                            if (friendlyThis != friendlyThis.toUpperCase()) {
                                friendlyThis = friendlyThis.replace(/([A-Z])/g, ' $1').trim();
                            }
                            registerAction(this.constructor.name.toLowerCase() + "_" + variable.field, variable.field, verb + friendlyThis + " " + variable.description, selectTypeObj, { description: this.describe(), target: this });
                            if (variable.relative) {
                                registerAction(this.constructor.name.toLowerCase() + "_" + variable.field + "_relative", variable.field, verb + friendlyThis + " " + variable.description + " (relative)", selectTypeObj, { description: this.describe(), target: this });
                            }
                            // If boolean, register feedback
                            if (typeof this[variable.field] == "boolean") {
                                registerFeedback(this.constructor.name.toLowerCase() + "_" + variable.field, variable.field, friendlyThis + " " + variable.description, { description: this.describe(), target: this });
                            }
                            values[varId] = this[variable.field];
                        }
                        // Check if variable is an object and has initCompanionData
                        if (this[variable.field]["initCompanionData"] != undefined) {
                            var fullDesc = descriptionBase + variable.description + " ";
                            fullDesc = fullDesc.replace(/ +(?= )/g, '');
                            this[variable.field]["initCompanionData"](variables, values, fullDesc);
                        } else if (this[variable.field] instanceof Array) {
                            for (const element of this[variable.field]) {
                                if (element["initCompanionData"] != undefined) {
                                    var fullDesc = descriptionBase + variable.description + " " + element["_id"] + " ";
                                    fullDesc = fullDesc.replace(/ +(?= )/g, '');
                                    element["initCompanionData"](variables, values, fullDesc);
                                }
                            }
                        }
                    }
                }
            }
    
            if (this["__pending_changes"] == undefined) {
                this["__pending_changes"] = []; // array of field names
            }

            // Override set to track changes
            try {
                var originalSet = Object.getOwnPropertyDescriptor(this, property.name).set;
                Object.defineProperty(this, property.name, {
                    set: function (this: any, value: any) {
                        if (!(this["__pending_changes"].includes(property.name))) {
                            this["__pending_changes"].push(property.name);
                        }
                        originalSet.call(this, value);
                    }
                });
            } catch (e) {
                // console.log("Unable to override set for " + property.name.toString() + " in " + this.constructor.name);
            }

            if (this["updateCompanionVariables"] == undefined) {
                this["updateCompanionVariables"] = function (this: any, values: CompanionVariableValues) {
                    if (this["__companion_data"] == undefined) {
                        return;
                    }
    
                    if (this["__jsonPath"] == undefined) {
                        throw new Error("Class must be a @WingObject and have completeJsonPath() called on it before initCompanionData() is called");
                    }
    
                    for (const variable of this["__companion_data"]) {
                        // Only set if primitive type (string, number, boolean)
                        if (typeof this[variable.field] != "object") {
                            // Check if changed
                            if (this["__pending_changes"].includes(variable.field)) {
                                values[this["__jsonPath"].replaceAll("/", "_") + "_" + variable.field] = this[variable.field];
                            }
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
                    this["__pending_changes"] = [];
                }
            }
        });
    }
}

export function registerActionsAndFeedbacks(instance: InstanceBase<any>) {
    var actions: CompanionActionDefinitions = {};
    var feedbacks: CompanionFeedbackDefinitions = {};
    for (const [id, data] of actionsById) {
        var selectType = data.createSelectType();
        var needTarget = selectType != undefined;
        var options: SomeCompanionActionInputField[] = [];
        if (selectType != undefined) {
            options.push(selectType);
        }
        options.push(data.optionData);
        var action = {
            id: id,
            label: data.description,
            name: data.description,
            options: options,
            callback: function (this: InstanceBase<any>, action: CompanionActionEvent) {
                var target: TargetData;
                if (needTarget) {
                    target = data.targetChoices.get(action.options.target as string)
                } else {
                    target = data.targetChoices.values().next().value;
                }
                if (target == undefined) {
                    throw new Error("Target not found");
                }
                var targetObject = target.target;
                if (targetObject == undefined) {
                    throw new Error("Target object not found");
                }
                targetObject[data.fieldName] = action.options.value;
                var values: CompanionVariableValues = {};
                targetObject["updateCompanionVariables"](values);
                instance.setVariableValues(values);
            }
        };
        actions[id] = action;
    }
    for (const [id, data] of feedbacksById) {
        var fbSelectType = data.createSelectType();
        var needTarget = fbSelectType != undefined;
        var fbOptions: SomeCompanionFeedbackInputField[] = [];
        if (selectType != undefined) {
            options.push(selectType);
        }
        var feedback: CompanionBooleanFeedbackDefinition = {
            type: "boolean",
            name: data.description,
            defaultStyle: {
              // The default style change for a boolean feedback
              // The user will be able to customise these values as well as the fields that will be changed
              bgcolor: combineRgb(255, 0, 0),
              color: combineRgb(0, 0, 0),
            },
            // options is how the user can choose the condition the feedback activates for
            options: fbOptions,
            callback: (feedback) => {
                var target: TargetData;
                if (needTarget) {
                    target = data.targetChoices.get(feedback.options.target as string)
                } else {
                    target = data.targetChoices.values().next().value;
                }

                if (target == undefined) {
                    throw new Error("Target not found");
                }
                var targetObject = target.target;
                if (targetObject == undefined) {
                    throw new Error("Target object not found");
                }
                return targetObject[data.fieldName];
              }
        };
        feedbacks[id] = feedback;
    }
    instance.setActionDefinitions(actions);
    instance.setFeedbackDefinitions(feedbacks);
}

function determineSelectType(type: any): object {
    if (type == Boolean) {
        return {
            type: "checkbox"
        }
    } else if (type == Number) {
        return {
            type: "number"
        }
    } else if (type == String) {
        return {
            type: "textinput"
        }
    } else {
        throw new Error("Unknown type: " + type);
    }
}

export function rangedNunberSelectType(min: number, max: number, step: number = 1): object {
    return {
        type: "number",
        min: min,
        max: max,
        step: step,
        range: true
    }
}