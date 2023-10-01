import { Named } from "./base.js";
import { registerAdapter } from "./parse/adapter_registry.js";
import { WingObject, WingProperty } from "./parse/decorators.js";

class InputMode {
    constructor(public readonly code: string) {}
    
    static MONO = new InputMode("M");
    static STEREO = new InputMode("ST");
    static MID_SIDE = new InputMode("M/S");

    toString() {
        return this.code;
    }

    static {
        registerAdapter(InputMode, {
            serialize: function (data: string) {
                switch (data) {
                    case "M":
                        return InputMode.MONO;
                    case "ST":
                        return InputMode.STEREO;
                    case "M/S":
                        return InputMode.MID_SIDE;
                    default:
                        throw new Error("Unknown input mode: " + data);
                }
            },
            deserialize: function (data: InputMode) {
                return data.code;
            }
        });
    }
}

@WingObject
class Input extends Named {
    @WingProperty("mode", InputMode)
    inputMode: InputMode = InputMode.MONO;
    @WingProperty("g", Number)
    inputGain: number = 0;
    @WingProperty("vph", Boolean)
    phantomPower: boolean = false;
    @WingProperty("mute", Boolean)
    mute: boolean = false;
    @WingProperty("pol", Boolean)
    polarity: boolean = false;

    toString() {
        this.inputMode.valueOf
        return this.name + " (mode: " + this.inputMode + ", gain: " + this.inputGain + ", phantom power: " + this.phantomPower + ", mute: " + this.mute + ", polarity reversed: " + this.polarity + ")";
    }
}

export { Input, InputMode };
