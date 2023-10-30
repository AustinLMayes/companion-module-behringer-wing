import type { CompanionActionDefinitions, CompanionFeedbackDefinitions, CompanionVariableDefinition } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { busDropdown, busDropdownWithMatrices, mainsDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupBusses(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_bus_color"] = {
        name: "Set Bus Color",
        description: "Set the color for the specified bus",
        options: [
            busDropdown,
            wingColorsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.color as number
            const selectedBus = action.options.bus as string
            instance.sendOSCInteger('/bus/' + selectedBus + '/col', selectedOption)
        }
    }

    actions["set_bus_name"] = {
        name: "Set Bus Name",
        description: "Set the name for the specified bus",
        options: [
            busDropdown,
            {
                type: 'textinput',
                label: 'Name',
                id: 'name',
                default: ''
            }
        ],
        callback: function (action) {
            const selectedBus = action.options.bus as string
            const selectedName = action.options.name as string
            instance.sendOSCString('/bus/' + selectedBus + '/name', selectedName)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_name",
            name: "Bus " + i + " Name"
        })
    }

    actions["set_bus_led"] = {
        name: "Set Bus Scribble Light",
        description: "Turn the scribble light on or off for the specified bus",
        options: [
            busDropdown,
            {
                id: 'led',
                type: 'checkbox',
                label: 'Sciibble Light',
                default: false
            }
        ],
        callback: function (action) {
            const selectedBus = action.options.bus as string
            const selectedLed = action.options.led as boolean
            instance.sendOSCInteger('/bus/' + selectedBus + '/led', selectedLed ? 1 : 0)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_led",
            name: "Bus " + i + " Scribble Light"
        })
    }

    actions["set_bus_mono"] = {
        name: "Set Bus Mono",
        description: "Set the specified bus to mono or stereo",
        options: [
            busDropdown,
            {
                id: 'mono',
                type: 'checkbox',
                label: 'Mono',
                default: false
            }
        ],
        callback: function (action) {
            const selectedBus = action.options.bus as string
            const selectedMono = action.options.mono as boolean
            instance.sendOSCInteger('/bus/' + selectedBus + '/busmono', selectedMono ? 1 : 0)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_busmono",
            name: "Bus " + i + " Mono"
        })
    }

    actions["set_bus_mute"] = {
        name: "Set Bus Mute",
        description: "Mute or unmute the specified bus",
        options: [
            busDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            }
        ],
        callback: function (action) {
            const selectedBus = action.options.bus as string
            const selectedMute = action.options.mute as boolean
            instance.sendOSCInteger('/bus/' + selectedBus + '/mute', selectedMute ? 1 : 0)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_mute",
            name: "Bus " + i + " Muted"
        })
    }

    actions["set_bus_fader"] = {
        name: "Set Bus Fader",
        description: "Set the fader position for the specified bus",
        options: [
            busDropdown,
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
            const selectedBus = action.options.bus as string
            instance.fadeValueTo('/bus/' + selectedBus + '/fdr', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_fdr",
            name: "Bus " + i + " Fader Level"
        })
    }

    actions["set_bus_pan"] = {
        name: "Set Bus Pan",
        description: "Set the pan position for the specified bus",
        options: [
            busDropdown,
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
            const selectedBus = action.options.bus as string
            instance.fadeValueTo('/bus/' + selectedBus + '/pan', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_pan",
            name: "Bus " + i + " Pan Position"
        })
    }

    actions["set_bus_width"] = {
        name: "Set Bus Width",
        description: "Set the width for the specified bus",
        options: [
            busDropdown,
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
            const selectedBus = action.options.bus as string
            instance.fadeValueTo('/bus/' + selectedBus + '/wid', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 16; i++) {
        variables.push({
            variableId: "bus_" + i + "_wid",
            name: "Bus " + i + " Pan Width"
        })
    }

    actions["set_bus_main_on"] = {
        name: "Set Bus Main On",
        description: "Turn the specified main output for the specified bus on or off",
        options: [
            busDropdown,
            mainsDropdown,
            {
                id: 'on',
                type: 'checkbox',
                label: 'On',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.on as boolean
            const selectedMain = action.options.main as number
            const selectedBus = action.options.bus as string
            instance.sendOSCBoolean('/bus/' + selectedBus + '/main/' + selectedMain + '/on', selectedOption)
        }
    }

    for (let i = 1; i <= 16; i++) {
        for (let j = 1; j <= 4; j++) {
            variables.push({
                variableId: "bus_" + i + "_main_" + j + "_on",
                name: "Bus " + i + " Main " + j + " On"
            })
        }
    }

    actions["set_bus_main_level"] = {
        name: "Set Bus Main Level",
        description: "Set the level for the specified main output for the specified bus",
        options: [
            busDropdown,
            mainsDropdown,
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
            const selectedMain = action.options.main as number
            const selectedBus = action.options.bus as string
            instance.fadeValueTo('/bus/' + selectedBus + '/main/' + selectedMain + '/lvl', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 16; i++) {
        for (let j = 1; j <= 4; j++) {
            variables.push({
                variableId: "bus_" + i + "_main_" + j + "_lvl",
                name: "Bus " + i + " Main " + j + " Level"
            })
        }
    }

    actions["set_ch_bus_on"] = {
        name: "Set Bus Send On",
        description: "Turn the specified bus/matrix output for the specified bus on or off",
        options: [
            busDropdown,
            busDropdownWithMatrices,
            {
                id: 'on',
                type: 'checkbox',
                label: 'On',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.on as boolean
            const selectedBus = action.options.bus as number
            const selectedBusMatrix = action.options.bus_mx as string
            instance.sendOSCBoolean('/bus/' + selectedBus + '/send/' + selectedBusMatrix + '/on', selectedOption)
        }
    }

    for (let i = 1; i <= 16; i++) {
        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "bus_" + i + "_send_" + j + "_on",
                name: "Bus " + i + " Send " + j + " On"
            })
        }

        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "bus_" + i + "_send_mx" + j + "_on",
                name: "Bus " + i + " Matrix Send " + j + " On"
            })
        }
    }

    actions["set_ch_bus_level"] = {
        name: "Set Channel Bus Level",
        description: "Set the level for the specified bus/matrix output for the specified bus",
        options: [
            busDropdown,
            busDropdownWithMatrices,
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
            const selectedBus = action.options.bus as number
            const selectedBusMatrix = action.options.bus_mx as string
            instance.fadeValueTo('/bus/' + selectedBus + '/send/' + selectedBusMatrix + '/lvl', selectedOption, selectedDuration)
        }
    }

    for (let i = 1; i <= 16; i++) {
        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "bus_" + i + "_send_" + j + "_lvl",
                name: "Bus " + i + " Send " + j + " Level"
            })
        }

        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "bus_" + i + "_send_mx" + j + "_lvl",
                name: "Bus " + i + " Matrix Send " + j + " Level"
            })
        }
    }

    actions["set_ch_bus_pre"] = {
        name: "Set Channel Bus Pre",
        description: "Set the pre/post setting for the specified bus/matrix output for the specified bus",
        options: [
            busDropdown,
            busDropdownWithMatrices,
            {
                id: 'pre',
                type: 'checkbox',
                label: 'Pre',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.pre as boolean
            const selectedBus = action.options.bus as number
            const selectedBusMatrix = action.options.bus_mx as string
            instance.sendOSCBoolean('/bus/' + selectedBus + '/send/' + selectedBusMatrix + '/pre', selectedOption)
        }
    }

    for (let i = 1; i <= 16; i++) {
        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "bus_" + i + "_send_" + j + "_pre",
                name: "Bus " + i + " Send " + j + " Pre"
            })
        }

        for (let j = 1; j <= 8; j++) {
            variables.push({
                variableId: "bus_" + i + "_send_mx" + j + "_pre",
                name: "Bus " + i + " Matrix Send " + j + " Pre"
            })
        }
    }

}