import type { CompanionActionDefinitions, CompanionFeedbackDefinitions, CompanionVariableDefinition } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { dcasDropdown, matrixDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupDCAs(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_dca_color"] = {
        name: "Set DCA Color",
        description: "Set the color for the specified DCA",
        options: [
            dcasDropdown,
            wingColorsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.color as number
            const selectedDCA = action.options.dca as string
            instance.sendOSCInteger('/dca/' + selectedDCA + '/col', selectedOption)
        }
    }

    actions["set_dca_name"] = {
        name: "Set DCA Name",
        description: "Set the name for the specified DCA",
        options: [
            dcasDropdown,
            {
                type: 'textinput',
                label: 'Name',
                id: 'name',
                default: ''
            }
        ],
        callback: function (action) {
            const selectedDCA = action.options.dca as string
            const selectedName = action.options.name as string
            instance.sendOSCString('/dca/' + selectedDCA + '/name', selectedName)
        }
    }

    actions["set_dca_led"] = {
        name: "Set DCA Scribble Light",
        description: "Turn the scribble light on or off for the specified DCA",
        options: [
            dcasDropdown,
            {
                id: 'led',
                type: 'checkbox',
                label: 'Sciibble Light',
                default: false
            }
        ],
        callback: function (action) {
            const selectedDCA = action.options.dca as string
            const selectedLed = action.options.led as boolean
            instance.sendOSCInteger('/dca/' + selectedDCA + '/led', selectedLed ? 1 : 0)
        }
    }

    actions["set_dca_mute"] = {
        name: "Set DCA Mute",
        description: "Mute or unmute the specified DCA",
        options: [
            dcasDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            }
        ],
        callback: function (action) {
            const selectedDCA = action.options.dca as string
            const selectedMute = action.options.mute as boolean
            instance.sendOSCInteger('/dca/' + selectedDCA + '/mute', selectedMute ? 1 : 0)
        }
    }

    actions["set_dca_fader"] = {
        name: "Set DCA Fader",
        description: "Set the fader position for the specified DCA",
        options: [
            dcasDropdown,
            {
                id: 'fader',
                type: 'number',
                label: 'Fader',
                min: -144,
                max: 10,
                default: 0,
                range: true
            },
            {
                id: "fade_duration",
                type: "number",
                label: "Fade Duration (Seconds)",
                min: 0,
                max: 60,
                default: 0
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.fader as number
            const selectedDuration = action.options.fade_duration as number
            const selectedDCA = action.options.dca as string
            instance.fadeValueTo('/dca/' + selectedDCA + '/fdr', selectedOption, selectedDuration)
        }
    }
}