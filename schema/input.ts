import { CompanionVariable } from "../variables/variable-decorators.js";
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
    @CompanionVariable("Mode")
    inputMode: InputMode = InputMode.MONO;
    @WingProperty("g", Number)
    @CompanionVariable("Gain")
    inputGain: number = 0;
    @WingProperty("vph", Boolean)
    @CompanionVariable("Phantom Power")
    phantomPower: boolean = false;
    @WingProperty("mute", Boolean)
    @CompanionVariable("Muted")
    mute: boolean = false;
    @WingProperty("pol", Boolean)
    @CompanionVariable("Polarity Reversed")
    polarity: boolean = false;

    toString() {
        this.inputMode.valueOf
        return this.name + " (mode: " + this.inputMode + ", gain: " + this.inputGain + ", phantom power: " + this.phantomPower + ", mute: " + this.mute + ", polarity reversed: " + this.polarity + ")";
    }
}

export { Input, InputMode };
