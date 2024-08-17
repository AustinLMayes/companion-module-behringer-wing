import type { InstanceBase } from "@companion-module/base"
import { log } from "console"
import fs from 'fs'

export class MixerState {
    private internalState: any = {}
    private instance: InstanceBase<any>

    constructor(instance: InstanceBase<any>) {
        this.instance = instance
    }
    private instance: InstanceBase<any>

    constructor(instance: InstanceBase<any>) {
        this.instance = instance
    }

    get(path: string): any {
        path = path.toLowerCase()
        if (path[0] == '/') {
            path = path.substring(1)
        }
        var mixerState = this.internalState
        var addressParts = path.split('/')
        for (var i = 0; i < addressParts.length; i++) {
            if (!mixerState[addressParts[i]]) {
                throw new Error('Mixer state is null for path ' + path)
            }
            mixerState = mixerState[addressParts[i]]
        }
        if (mixerState == null) {
            throw new Error('Mixer state is null for path ' + path)
        }
        console.log('returning ' + mixerState)
        return mixerState
    }

    getOrDefault(path: string, defaultValue: any): any {
        try {
            var value = this.get(path)
            if (value == null) {
                return defaultValue
            }
            return value
        } catch (e) {
            return defaultValue
        }
    }

    set(path: string, value: any): void {
        if (path.startsWith("/"))
            path = path.replace(/^\/+/, '')
        if (value == "-oo") {
            value = -144
        }
        path = path.toLowerCase()
        var mixerState = this.internalState
        var addressParts = path.split('/')
        for (var i = 0; i < addressParts.length - 1; i++) {
            if (!(mixerState[addressParts[i]] instanceof Object)) {
                mixerState[addressParts[i]] = {}
            }
            mixerState = mixerState[addressParts[i]]
        }
        mixerState[addressParts[addressParts.length - 1]] = value
        var varName = path.replace(/\//g, '_')
        console.log('Setting variable ' + varName + ' to ' + value)
        this.instance.setVariableValues({[varName]: value})
    }

    fromJson(json: string): void {
        var jsonObject = JSON.parse(json)['ae_data']
        for (var key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                this.setFromJsonTree(key, jsonObject[key])
            } else
                throw new Error('JSON object has no key ' + key)
        }
    }

    setFromJsonTree(parent: string, json: any): void {
        // If the JSON object is a primitive, set the value - else call setFromJsonTree for each key in the JSON object
        if (json instanceof Object) {
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    this.setFromJsonTree(parent + '/' + key, json[key])
                }
            }
        } else {
            this.set(parent, json)
        }
    }
}