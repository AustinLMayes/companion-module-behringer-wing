import type { CompanionActionDefinitions, CompanionFeedbackDefinitions, CompanionVariableDefinition } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { busDropdown, channelDropdown, inputDropdown, mainsDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupChannels(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    setupIO(instance, actions, variables, feedbacks)

    actions["set_ch_color"] = {
        name: "Set Channel Color",
        description: "Set the color for the specified channel",
        options: [
            channelDropdown,
            wingColorsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.color as number
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCInteger('/' + selectedChannel + '/col', selectedOption)
        }
    }

    actions["set_ch_name"] = {
        name: "Set Channel Name",
        description: "Set the name for the specified channel",
        options: [
            channelDropdown,
            {
                id: 'name',
                type: 'textinput',
                label: 'Name',
                default: ''
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.name as string
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCString('/' + selectedChannel + '/name', selectedOption)
        }
    }

    actions["set_ch_led"] = {
        name: "Set Channel Scribble Light",
        description: "Turn the scribble light on or off for the specified channel",
        options: [
            channelDropdown,
            {
                id: 'led',
                type: 'checkbox',
                label: 'Sciibble Light',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.led as boolean
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCBoolean('/' + selectedChannel + '/led', selectedOption)
        }
    }

    actions["set_ch_mute"] = {
        name: "Set Channel Mute",
        description: "Mute or unmute the specified channel",
        options: [
            channelDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.mute as boolean
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCBoolean('/' + selectedChannel + '/mute', selectedOption)
        }
    }

    actions["set_ch_fader"] = {
        name: "Set Channel Fader",
        description: "Set the fader position for the specified channel",
        options: [
            channelDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.fadeValueTo('/' + selectedChannel + '/fdr', selectedOption, selectedDuration)
        }
    }

    actions["set_ch_pan"] = {
        name: "Set Channel Pan",
        description: "Set the pan position for the specified channel",
        options: [
            channelDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.fadeValueTo('/' + selectedChannel + '/pan', selectedOption, selectedDuration)
        }
    }

    actions["set_ch_width"] = {
        name: "Set Channel Width",
        description: "Set the width for the specified channel",
        options: [
            channelDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.fadeValueTo('/' + selectedChannel + '/wid', selectedOption, selectedDuration)
        }
    }

    actions["set_ch_main_on"] = {
        name: "Set Channel Main On",
        description: "Turn the specified main output for the specified channel on or off",
        options: [
            channelDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCBoolean('/' + selectedChannel + '/main/' + selectedMain + '/on', selectedOption)
        }
    }

    actions["set_ch_main_level"] = {
        name: "Set Channel Main Level",
        description: "Set the level for the specified main output for the specified channel",
        options: [
            channelDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.fadeValueTo('/' + selectedChannel + '/main/' + selectedMain + '/lvl', selectedOption, selectedDuration)
        }
    }

    actions["set_ch_bus_on"] = {
        name: "Set Channel Bus On",
        description: "Turn the specified bus output for the specified channel on or off",
        options: [
            channelDropdown,
            busDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCBoolean('/' + selectedChannel + '/send/' + selectedBus + '/on', selectedOption)
        }
    }

    actions["set_ch_bus_level"] = {
        name: "Set Channel Bus Level",
        description: "Set the level for the specified bus output for the specified channel",
        options: [
            channelDropdown,
            busDropdown,
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
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.fadeValueTo('/' + selectedChannel + '/send/' + selectedBus + '/lvl', selectedOption, selectedDuration)
        }
    }
}

function setupIO(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_ch_main_input"] = {
        name: "Set Channel Main Input",
        description: "Set the main input for the specified channel",
        options: [
            channelDropdown,
            inputDropdown
        ],
        callback: function (action) {
            const selectedInput = action.options.input as string
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            var inputGroup = selectedInput.split('_')[0]
            var inputNumber = selectedInput.split('_')[1]
            instance.sendOSCString('/' + selectedChannel + '/in/conn/grp', inputGroup)
            instance.sendOSCString('/' + selectedChannel + '/in/conn/in', inputNumber)
        }
    }

    actions["set_ch_alt_input"] = {
        name: "Set Channel Alt Input",
        description: "Set the alt input for the specified channel",
        options: [
            channelDropdown,
            inputDropdown
        ],
        callback: function (action) {
            const selectedInput = action.options.input as string
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            var inputGroup = selectedInput.split('_')[0]
            var inputNumber = selectedInput.split('_')[1]
            instance.sendOSCString('/' + selectedChannel + '/in/conn/altgrp', inputGroup)
            instance.sendOSCString('/' + selectedChannel + '/in/conn/altin', inputNumber)
        }
    }

    actions["set_ch_alt_switch"] = {
        name: "Set Channel Alt Switch",
        description: "Set the alt switch for the specified channel",
        options: [
            channelDropdown,
            {
                id: 'position',
                type: 'checkbox',
                label: 'Position',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.position as boolean
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCBoolean('/' + selectedChannel + '/in/set/srcauto', selectedOption)
        }
    }

    actions["set_ch_alt"] = {
        name: "Set Channel Input Source",
        description: "Switch the input source for the specified channel between main and alt",
        options: [
            channelDropdown,
            {
                id: 'source',
                type: 'dropdown',
                label: 'Source',
                default: 'main',
                choices: [
                    { id: 'main', label: 'Main' },
                    { id: 'alt', label: 'Alt' }
                ]
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.source as string
            var selectedChannel = action.options.channel as string
            selectedChannel = selectedChannel.replace('_', '/')
            instance.sendOSCString('/' + selectedChannel + '/in/set/altsrc', selectedOption == 'main' ? '0' : '1')
        }
    }
}