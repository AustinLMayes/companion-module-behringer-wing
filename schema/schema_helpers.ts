import type { CompanionInputFieldDropdown } from "@companion-module/base";

function generateIODropdown(output: boolean): CompanionInputFieldDropdown {
    var dropdown = {
        id: output ? 'output' : 'input',
        type: 'dropdown',
        label: output ? 'Output' : 'Input',
        default: 'LCL_1',
        choices: []
    } as CompanionInputFieldDropdown

    var desc = output ? "Output" : "Input"

    for (let i = 1; i <= 2; i++) {
        dropdown.choices.push({ id: "AES_" + i, label: "AES " + desc + " " + i })
        dropdown.choices.push({ id: "OSC_" + i, label: "Oscalator " + desc + " " + i })
    }

    for (let i = 1; i <= 4; i++) {
        dropdown.choices.push({ id: "PLAY_" + i, label: "Playback " + desc + " " + i })
    }

    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: "LCL_" + i, label: "Local " + desc + " " + i })
        dropdown.choices.push({ id: "AUX_" + i, label: "Aux " + desc + " " + i })
    }

    for (let i = 1; i <= 24; i++) {
        dropdown.choices.push({ id: "USR_" + i, label: "User " + desc + " " + i })
    }

    for (let i = 1; i <= 48; i++) {
        dropdown.choices.push({ id: "A_" + i, label: "AES " + desc + " A " + i })
        dropdown.choices.push({ id: "B_" + i, label: "AES " + desc + " B " + i })
        dropdown.choices.push({ id: "C_" + i, label: "AES " + desc + " C " + i })
        dropdown.choices.push({ id: "USB_" + i, label: "USB " + desc + " " + i })
    }

    for (let i = 1; i <= 32; i++) {
        dropdown.choices.push({ id: "SC_" + i, label: "Stage Connect " + desc + " " + i })
    }

    for (let i = 1; i <= 64; i++) {
        dropdown.choices.push({ id: "CRD_" + i, label: "Card " + desc + " " + i })
        dropdown.choices.push({ id: "MOD_" + i, label: "Module " + desc + " " + i })
    }

    // sort the choices
    dropdown.choices.sort((a, b) => {
        return a.label.localeCompare(b.label)
    })

    return dropdown
}

export const inputDropdown = generateIODropdown(false)
export const outputDropdown = generateIODropdown(true)

function generateInputDropdownWithReturns(): CompanionInputFieldDropdown {
    var dropdown = generateIODropdown(false)
    for (let i = 1; i <= 2; i++) {
        dropdown.choices.push({ id: "MON_" + i, label: "Monitor " + i + " L" })
        dropdown.choices.push({ id: "MON_" + i + 1, label: "Monitor " + i + " R" })
        i++
    }
    for (let i = 1; i <= 4; i++) {
        dropdown.choices.push({ id: "MAIN_" + i, label: "Main " + i + " L" })
        dropdown.choices.push({ id: "MAIN_" + i + 1, label: "Main " + i + " R" })
        i++
    }
    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: "MTX_" + i, label: "Matrix " + i + " L" })
        dropdown.choices.push({ id: "MTX_" + i + 1, label: "Matrix " + i + " R" })
        i++
    }
    for (let i = 1; i <= 16; i++) {
        dropdown.choices.push({ id: "BUS_" + i, label: "Bus " + i + " L" })
        dropdown.choices.push({ id: "BUS_" + i + 1, label: "Bus " + i + " R" })
        dropdown.choices.push({ id: "SEND_" + i, label: "FX Send " + i + " L" })
        dropdown.choices.push({ id: "SEND_" + i + 1, label: "FX Send " + i + " R" })
        i++
    }
    return dropdown
}

export const inputDropdownWithReturns = generateInputDropdownWithReturns()

function generateWingColorsDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'color',
        type: 'dropdown',
        label: 'Color',
        default: '1',
        choices: [
            {
                id: '1',
                label: 'Gray Blue'
            },
            {
                id: '2',
                label: 'Medium Blue'
            },
            {
                id: '3',
                label: 'Dark Blue'
            },
            {
                id: '4',
                label: 'Turquoise'
            },
            {
                id: '5',
                label: 'Green'
            },
            {
                id: '6',
                label: 'Olive Green'
            },
            {
                id: '7',
                label: 'Yellow'
            },
            {
                id: '8',
                label: 'Orange'
            },
            {
                id: '9',
                label: 'Red'
            },
            {
                id: '10',
                label: 'Coral'
            },
            {
                id: '11',
                label: 'Pink'
            },
            {
                id: '12',
                label: 'Mauve'
            }
        ]
    } as CompanionInputFieldDropdown

    return dropdown
}

export const wingColorsDropdown = generateWingColorsDropdown()

function generateChannelDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'channel',
        type: 'dropdown',
        label: 'Channel',
        default: 'CH_1',
        choices: []
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 40; i++) {
        dropdown.choices.push({ id: "CH_" + i, label: "Channel " + i })
    }

    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: "AUX_" + i, label: "Aux " + i })
    }

    return dropdown
}

export const channelDropdown = generateChannelDropdown()

function generateMainsDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'main',
        type: 'dropdown',
        label: 'Main',
        default: '1',
        choices: []
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 4; i++) {
        dropdown.choices.push({ id: i, label: "Main " + i })
    }

    return dropdown
}

export const mainsDropdown = generateMainsDropdown()

function generateBusDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'bus',
        type: 'dropdown',
        label: 'Bus',
        default: '1',
        choices: []
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 16; i++) {
        dropdown.choices.push({ id: i, label: "Bus " + i })
    }

    return dropdown
}

export const busDropdown = generateBusDropdown()

function generateBusDropdownWithMatrices(): CompanionInputFieldDropdown {
    var dropdown = generateBusDropdown()
    dropdown.choices = dropdown.choices.filter((choice) => {
        return parseInt(choice.id.toString()) <= 8
    })
    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: "MX" + i, label: "Matrix " + i })
    }
    dropdown['label'] = 'Bus/Matrix'
    dropdown['id'] = 'bus_mx'
    return dropdown
}

export const busDropdownWithMatrices = generateBusDropdownWithMatrices()

function generateMatrixDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'matrix',
        type: 'dropdown',
        label: 'Matrix',
        default: '1',
        choices: []
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: i, label: "Matrix " + i })
    }

    return dropdown
}

export const matrixDropdown = generateMatrixDropdown()

function generateDirectInsDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'direct_in',
        type: 'dropdown',
        label: 'Direct In',
        default: 'OFF',
        choices: [
            {
                id: 'OFF',
                label: 'Off'
            }
        ]
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 40; i++) {
        dropdown.choices.push({ id: "CH." + i, label: "Channel " + i })
    }

    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: "AUX." + i, label: "Aux " + i })
    }

    return dropdown
}

export const directInsDropdown = generateDirectInsDropdown()

function generateDCAsDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'dca',
        type: 'dropdown',
        label: 'DCA',
        default: '1',
        choices: []
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 16; i++) {
        dropdown.choices.push({ id: i, label: "DCA " + i })
    }

    return dropdown
}

export const dcasDropdown = generateDCAsDropdown()

function generateMuteGroupsDropdown(): CompanionInputFieldDropdown {
    var dropdown = {
        id: 'mute_group',
        type: 'dropdown',
        label: 'Mute Group',
        default: '1',
        choices: []
    } as CompanionInputFieldDropdown

    for (let i = 1; i <= 8; i++) {
        dropdown.choices.push({ id: i, label: "Mute Group " + i })
    }

    return dropdown
}

export const muteGroupsDropdown = generateMuteGroupsDropdown()