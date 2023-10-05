export class MixerState {
    private internalState: any = {}

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
        path = path.toLowerCase()
        var mixerState = this.internalState
        var addressParts = path.split('/')
        for (var i = 0; i < addressParts.length - 1; i++) {
            if (!mixerState[addressParts[i]]) {
                mixerState[addressParts[i]] = {}
            }
            mixerState = mixerState[addressParts[i]]
        }
        mixerState[addressParts[addressParts.length - 1]] = value
    }

    fromJson(json: string): void {
        this.internalState = JSON.parse(json)['ae_data']
    }
}