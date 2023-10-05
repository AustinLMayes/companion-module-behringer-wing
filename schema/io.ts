import type { CompanionActionDefinition, CompanionActionDefinitions, CompanionActionEvent, CompanionFeedbackDefinitions, CompanionInputFieldCheckbox, CompanionVariableDefinition, CompanionVariableValues } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { inputDropdown, inputDropdownWithReturns, outputDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupIO(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_alt"] = {
        name: 'Set Main Alt Switch',
        description: 'Set the main alt switch to the specified position',
        options: [
            {
                id: 'position',
                type: 'checkbox',
                label: 'Position',
                default: false
            } as CompanionInputFieldCheckbox
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.position as boolean
            instance.sendOSCBoolean('/io/altsw', selectedOption)
        }
    }

    setupInputs(instance, actions, variables, feedbacks)
    setupOutputs(instance, actions, variables, feedbacks)
}

function setupInputs(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_in_mode"] = {
        name: "Set Input Mode",
        description: "Set the input mode for the specified input",
        options: [
            inputDropdown,
            {
                id: 'mode',
                type: 'dropdown',
                label: 'Mode',
                default: 'M',
                choices: [
                    { id: 'M', label: 'Mono' },
                    { id: 'S', label: 'Stereo' },
                    { id: 'M/S', label: 'Mid/Side' }
                ]
            }
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.mode as string
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCString('/io/in/' + selectedInput + '/mode', selectedOption)
        }
    }

    actions["mute_in"] = {
        name: "Mute Input",
        description: "Mute the specified input",
        options: [
            inputDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            } as CompanionInputFieldCheckbox
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.mute as boolean
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCBoolean('/io/in/' + selectedInput + '/mute', selectedOption)
        }
    }

    actions["set_in_color"] = {
        name: "Set Input Color",
        description: "Set the color of the specified input",
        options: [
            inputDropdown,
            wingColorsDropdown
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.color as number
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCInteger('/io/in/' + selectedInput + '/col', selectedOption)
        }
    }

    actions["set_in_name"] = {
        name: "Set Input Name",
        description: "Set the name of the specified input",
        options: [
            inputDropdown,
            {
                id: 'name',
                type: 'textinput',
                label: 'Name',
                default: ''
            }
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.name as string
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCString('/io/in/' + selectedInput + '/name', selectedOption)
        }
    }

    actions["set_in_gain"] = {
        name: "Set Input Gain",
        description: "Set the gain of the specified input",
        options: [
            inputDropdown,
            {
                id: 'gain',
                type: 'number',
                label: 'Gain',
                min: -3,
                max: 45.5,
                default: 0,
                range: true
            }
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.gain as number
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCFloatingPoint('/io/in/' + selectedInput + '/g', selectedOption)
        }
    }

    actions["set_in_phantom"] = {
        name: "Set Input Phantom Power",
        description: "Set the phantom power of the specified input",
        options: [
            inputDropdown,
            {
                id: 'phantom',
                type: 'checkbox',
                label: 'Phantom Power',
                default: false
            } as CompanionInputFieldCheckbox
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.phantom as boolean
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCBoolean('/io/in/' + selectedInput + '/vph', selectedOption)
        }
    }
    
    actions["set_in_polarity"] = {
        name: "Set Input Polarity",
        description: "Set the polarity of the specified input",
        options: [
            inputDropdown,
            {
                id: 'polarity',
                type: 'checkbox',
                label: 'Polarity',
                default: false
            } as CompanionInputFieldCheckbox
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.polarity as boolean
            var selectedInput = action.options.input as string
            selectedInput = selectedInput.replace('_', '/')
            instance.sendOSCBoolean('/io/in/' + selectedInput + '/pol', selectedOption)
        }
    }
}

function setupOutputs(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_out_in"] = {
        name: "Set Output Direct Input",
        description: "Set the direct input of the specified output",
        options: [
            outputDropdown,
            inputDropdownWithReturns
        ],
        callback: function (action: CompanionActionEvent): void {
            const selectedOption = action.options.input as string
            var selectedOutput = action.options.output as string
            selectedOutput = selectedOutput.replace('_', '/')
            var outputGroup = selectedOption.split('_')[0]
            var outputNumber = selectedOption.split('_')[1]
            instance.sendOSCString('/io/out/' + selectedOutput + '/grp', outputGroup)
            instance.sendOSCString('/io/out/' + selectedOutput + '/in', outputNumber)
        }
    }
}