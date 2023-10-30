import type { CompanionActionDefinitions, CompanionFeedbackDefinitions, CompanionVariableDefinition } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { mainsDropdown, matrixDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupMains(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_main_color"] = {
        name: "Set Main Color",
        description: "Set the color for the specified main",
        options: [
            mainsDropdown,
            wingColorsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.color as number
            const selectedMain = action.options.main as string
            instance.sendOSCInteger('/main/' + selectedMain + '/col', selectedOption)
        }
    }

    actions["set_main_name"] = {
        name: "Set Main Name",
        description: "Set the name for the specified main",
        options: [
            mainsDropdown,
            {
                type: 'textinput',
                label: 'Name',
                id: 'name',
                default: ''
            }
        ],
        callback: function (action) {
            const selectedMain = action.options.main as string
            const selectedName = action.options.name as string
            instance.sendOSCString('/main/' + selectedMain + '/name', selectedName)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_name",
            name: "Main " + i + " Name"
        })
    }

    actions["set_main_led"] = {
        name: "Set Main Scribble Light",
        description: "Turn the scribble light on or off for the specified main",
        options: [
            mainsDropdown,
            {
                id: 'led',
                type: 'checkbox',
                label: 'Sciibble Light',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMain = action.options.main as string
            const selectedLed = action.options.led as boolean
            instance.sendOSCInteger('/main/' + selectedMain + '/led', selectedLed ? 1 : 0)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_led",
            name: "Main " + i + " Scribble Light"
        })
    }

    actions["set_main_mono"] = {
        name: "Set Main Mono",
        description: "Set the specified main to mono or stereo",
        options: [
            mainsDropdown,
            {
                id: 'mono',
                type: 'checkbox',
                label: 'Mono',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMain = action.options.main as string
            const selectedMono = action.options.mono as boolean
            instance.sendOSCInteger('/main/' + selectedMain + '/busmono', selectedMono ? 1 : 0)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_busmono",
            name: "Main " + i + " Mono"
        })
    }

    actions["set_main_mute"] = {
        name: "Set Main Mute",
        description: "Mute or unmute the specified main",
        options: [
            mainsDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMain = action.options.main as string
            const selectedMute = action.options.mute as boolean
            instance.sendOSCInteger('/main/' + selectedMain + '/mute', selectedMute ? 1 : 0)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_mute",
            name: "Main " + i + " Muted"
        })
    }

    actions["set_main_fader"] = {
        name: "Set Main Fader",
        description: "Set the fader position for the specified main",
        options: [
            mainsDropdown,
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
            const selectedMain = action.options.main as string
            instance.fadeValueTo('/main/' + selectedMain + '/fdr', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_fdr",
            name: "Main " + i + " Fader"
        })
    }

    actions["set_main_pan"] = {
        name: "Set Main Pan",
        description: "Set the pan position for the specified main",
        options: [
            mainsDropdown,
            {
                id: 'pan',
                type: 'number',
                label: 'Pan',
                min: -100,
                max: 100,
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
            const selectedOption = action.options.pan as number
            const selectedDuration = action.options.fade_duration as number
            const selectedMain = action.options.main as string
            instance.fadeValueTo('/main/' + selectedMain + '/pan', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_pan",
            name: "Main " + i + " Pan"
        })
    }

    actions["set_main_width"] = {
        name: "Set Main Width",
        description: "Set the width for the specified main",
        options: [
            mainsDropdown,
            {
                id: 'width',
                type: 'number',
                label: 'Width',
                min: -150,
                max: 150,
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
            const selectedOption = action.options.width as number
            const selectedDuration = action.options.fade_duration as number
            const selectedMain = action.options.main as string
            instance.fadeValueTo('/main/' + selectedMain + '/wid', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 4; i++) {
        variables.push({
            variableId: "main_" + i + "_wid",
            name: "Main " + i + " Width"
        })
    }

    actions["set_main_mtx_on"] = {
        name: "Set Main Send On",
        description: "Turn the specified matrix send on or off for the specified main",
        options: [
            mainsDropdown,
            matrixDropdown,
            {
                id: 'on',
                type: 'checkbox',
                label: 'On',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.on as boolean
            const selectedMain = action.options.main as string
            const selectedMatrix = action.options.matrix as string
            instance.sendOSCInteger('/main/' + selectedMain + '/send/MX' + selectedMatrix + '/on', selectedOption ? 1 : 0)
        }
    }

    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "main_" + i + "_send_mx" + j + "_on",
                name: "Main " + i + " Matrix Send " + j + " On"
            })
        }
    }

    actions["set_main_mtx_level"] = {
        name: "Set Main Send Level",
        description: "Set the level for the specified matrix send for the specified main",
        options: [
            mainsDropdown,
            matrixDropdown,
            {
                id: 'level',
                type: 'number',
                label: 'Level',
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
            const selectedOption = action.options.level as number
            const selectedDuration = action.options.fade_duration as number
            const selectedMain = action.options.main as string
            const selectedMatrix = action.options.matrix as string
            instance.fadeValueTo('/main/' + selectedMain + '/send/MX' + selectedMatrix + '/lvl', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "main_" + i + "_send_mx" + j + "_lvl",
                name: "Main " + i + " Matrix Send " + j + " Level"
            })
        }
    }

    actions["set_main_mtx_pre"] = {
        name: "Set Main Send Pre",
        description: "Set the pre/post setting for the specified matrix send for the specified main",
        options: [
            mainsDropdown,
            matrixDropdown,
            {
                id: 'pre',
                type: 'checkbox',
                label: 'Pre',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.pre as boolean
            const selectedMain = action.options.main as string
            const selectedMatrix = action.options.matrix as string
            instance.sendOSCInteger('/main/' + selectedMain + '/send/MX' + selectedMatrix + '/pre', selectedOption ? 1 : 0)
        }
    }

    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "main_" + i + "_send_mx" + j + "_pre",
                name: "Main " + i + " Matrix Send " + j + " Pre"
            })
        }
    }
}