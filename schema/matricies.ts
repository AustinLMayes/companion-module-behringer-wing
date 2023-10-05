import type { CompanionActionDefinitions, CompanionFeedbackDefinitions, CompanionVariableDefinition } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { directInsDropdown, matrixDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupMatricies(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_matrix_color"] = {
        name: "Set Matrix Color",
        description: "Set the color for the specified matrix",
        options: [
            matrixDropdown,
            wingColorsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.color as number
            const selectedMatrix = action.options.matrix as string
            instance.sendOSCInteger('/mtx/' + selectedMatrix + '/col', selectedOption)
        }
    }

    actions["set_matrix_name"] = {
        name: "Set Matrix Name",
        description: "Set the name for the specified matrix",
        options: [
            matrixDropdown,
            {
                type: 'textinput',
                label: 'Name',
                id: 'name',
                default: ''
            }
        ],
        callback: function (action) {
            const selectedMatrix = action.options.matrix as string
            const selectedName = action.options.name as string
            instance.sendOSCString('/mtx/' + selectedMatrix + '/name', selectedName)
        }
    }

    actions["set_matrix_led"] = {
        name: "Set Matrix Scribble Light",
        description: "Turn the scribble light on or off for the specified matrix",
        options: [
            matrixDropdown,
            {
                id: 'led',
                type: 'checkbox',
                label: 'Sciibble Light',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMatrix = action.options.matrix as string
            const selectedLed = action.options.led as boolean
            instance.sendOSCInteger('/mtx/' + selectedMatrix + '/led', selectedLed ? 1 : 0)
        }
    }

    actions["set_matrix_mono"] = {
        name: "Set Matrix Mono",
        description: "Set the specified matrix to mono or stereo",
        options: [
            matrixDropdown,
            {
                id: 'mono',
                type: 'checkbox',
                label: 'Mono',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMatrix = action.options.matrix as string
            const selectedMono = action.options.mono as boolean
            instance.sendOSCInteger('/mtx/' + selectedMatrix + '/busmono', selectedMono ? 1 : 0)
        }
    }

    actions["set_matrix_mute"] = {
        name: "Set Matrix Mute",
        description: "Mute or unmute the specified matrix",
        options: [
            matrixDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMatrix = action.options.matrix as string
            const selectedMute = action.options.mute as boolean
            instance.sendOSCInteger('/mtx/' + selectedMatrix + '/mute', selectedMute ? 1 : 0)
        }
    }

    actions["set_matrix_fader"] = {
        name: "Set Matrix Fader",
        description: "Set the fader position for the specified matrix",
        options: [
            matrixDropdown,
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
            const selectedMatrix = action.options.matrix as string
            instance.fadeValueTo('/mtx/' + selectedMatrix + '/fdr', selectedOption, selectedDuration)
        }
    }

    actions["set_matrix_pan"] = {
        name: "Set Matrix Pan",
        description: "Set the pan position for the specified matrix",
        options: [
            matrixDropdown,
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
            const selectedMatrix = action.options.matrix as string
            instance.fadeValueTo('/mtx/' + selectedMatrix + '/pan', selectedOption, selectedDuration)
        }
    }

    actions["set_matrix_width"] = {
        name: "Set Matrix Width",
        description: "Set the width for the specified matrix",
        options: [
            matrixDropdown,
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
            const selectedMatrix = action.options.matrix as string
            instance.fadeValueTo('/mtx/' + selectedMatrix + '/width', selectedOption, selectedDuration)
        }
    }

    actions["set_matrix_dir_on"] = {
        name: "Set Matrix Direct In On",
        description: "Turn the direct in on or off for the specified matrix",
        options: [
            matrixDropdown,
            {
                id: 'in',
                type: 'dropdown',
                label: 'Direct In',
                default: '1',
                choices: [
                    {
                        id: '1',
                        label: 'Direct In 1'
                    },
                    {
                        id: '2',
                        label: 'Direct In 2'
                    }
                ]
            },
            {
                id: 'direct_in',
                type: 'checkbox',
                label: 'On',
                default: false
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.in as string
            const selectedDirectIn = action.options.direct_in as boolean
            const selectedMatrix = action.options.matrix as string
            instance.sendOSCInteger('/mtx/' + selectedMatrix + '/dir/' + selectedOption + '/on', selectedDirectIn ? 1 : 0)
        }
    }

    actions["set_matrix_dir_in"] = {
        name: "Set Matrix Direct In",
        description: "Set the direct in for the specified matrix",
        options: [
            matrixDropdown,
            {
                id: 'in',
                type: 'dropdown',
                label: 'Direct In',
                default: '1',
                choices: [
                    {
                        id: '1',
                        label: 'Direct In 1'
                    },
                    {
                        id: '2',
                        label: 'Direct In 2'
                    }
                ]
            },
            directInsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.direct_in as string
            const selectedDirectIn = action.options.in as string
            const selectedMatrix = action.options.matrix as string
            instance.sendOSCString('/mtx/' + selectedMatrix + '/dir/' + selectedDirectIn + '/in', selectedOption)
        }
    }

    actions["set_matrix_dir_level"] = {
        name: "Set Matrix Direct In Level",
        description: "Set the direct in level for the specified matrix",
        options: [
            matrixDropdown,
            {
                id: 'in',
                type: 'dropdown',
                label: 'Direct In',
                default: '1',
                choices: [
                    {
                        id: '1',
                        label: 'Direct In 1'
                    },
                    {
                        id: '2',
                        label: 'Direct In 2'
                    }
                ]
            },
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
            const selectedDirectIn = action.options.in as string
            const selectedMatrix = action.options.matrix as string
            instance.fadeValueTo('/mtx/' + selectedMatrix + '/dir/' + selectedDirectIn + '/lvl', selectedOption, selectedDuration)
        }
    }

    actions["set_matrix_dir_tap"] = {
        name: "Set Matrix Direct In Tap",
        description: "Set the direct in tap for the specified matrix",
        options: [
            matrixDropdown,
            {
                id: 'in',
                type: 'dropdown',
                label: 'Direct In',
                default: '1',
                choices: [
                    {
                        id: '1',
                        label: 'Direct In 1'
                    },
                    {
                        id: '2',
                        label: 'Direct In 2'
                    }
                ]
            },
            {
                id: 'tap',
                type: 'dropdown',
                label: 'Tap',
                default: 'PRE',
                choices: [
                    {
                        id: 'PRE',
                        label: 'Pre'
                    },
                    {
                        id: 'POST',
                        label: 'Post'
                    }
                ]
            }
        ],
        callback: function (action) {
            const selectedOption = action.options.tap as string
            const selectedDirectIn = action.options.in as string
            const selectedMatrix = action.options.matrix as string
            instance.sendOSCString('/mtx/' + selectedMatrix + '/dir/' + selectedDirectIn + '/tap', selectedOption)
        }
    }
}