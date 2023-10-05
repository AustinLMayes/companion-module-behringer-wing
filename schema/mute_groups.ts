import type { CompanionActionDefinitions, CompanionFeedbackDefinitions, CompanionVariableDefinition } from "@companion-module/base";
import type { ModuleInstance } from "../main.js";
import { muteGroupsDropdown, wingColorsDropdown } from "./schema_helpers.js";

export function setupMuteGroups(instance: ModuleInstance, actions: CompanionActionDefinitions, variables: CompanionVariableDefinition[], feedbacks: CompanionFeedbackDefinitions): void {
    actions["set_mute_group_color"] = {
        name: "Set Mute Group Color",
        description: "Set the color for the specified Mute Group",
        options: [
            muteGroupsDropdown,
            wingColorsDropdown
        ],
        callback: function (action) {
            const selectedOption = action.options.color as number
            const selectedMuteGroup = action.options.mute_group as string
            instance.sendOSCInteger('/mgrp/' + selectedMuteGroup + '/col', selectedOption)
        }
    }

    actions["set_mute_group_mute"] = {
        name: "Set Mute Group Mute",
        description: "Mute or unmute the specified Mute Group",
        options: [
            muteGroupsDropdown,
            {
                id: 'mute',
                type: 'checkbox',
                label: 'Mute',
                default: false
            }
        ],
        callback: function (action) {
            const selectedMuteGroup = action.options.mute_group as string
            const selectedMute = action.options.mute as boolean
            instance.sendOSCInteger('/mgrp/' + selectedMuteGroup + '/mute', selectedMute ? 1 : 0)
        }
    }
}