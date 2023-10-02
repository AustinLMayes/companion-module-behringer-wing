import { ExposedValue, rangedNunberSelectType, type UserFacingObject } from "../companion-decorators.js";
import { Named } from "./base.js";
import type { IOCategory } from "./io.js";
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

    static modeSelectType(): object {
        return {
            type: "dropdown",
            default: "M",
            choices: [
                { id: "M", label: "Mono" },
                { id: "ST", label: "Stereo" },
                { id: "M/S", label: "Mid Side" }
            ]
        }
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
class Input extends Named implements UserFacingObject {
    _id: number;
    category: IOCategory;
    @WingProperty("mode", InputMode)
    @ExposedValue("Mode", InputMode.modeSelectType())
    inputMode: InputMode = InputMode.MONO;
    @WingProperty("g", Number)
    @ExposedValue("Gain", rangedNunberSelectType(-3, 45.5), true)
    inputGain: number = 0;
    @WingProperty("vph", Boolean)
    @ExposedValue("Phantom Power")
    phantomPower: boolean = false;
    @WingProperty("mute", Boolean)
    @ExposedValue("Muted")
    mute: boolean = false;
    @WingProperty("pol", Boolean)
    @ExposedValue("Polarity Reversed")
    polarity: boolean = false;

    toString() {
        this.inputMode.valueOf
        return this.name + " (mode: " + this.inputMode + ", gain: " + this.inputGain + ", phantom power: " + this.phantomPower + ", mute: " + this.mute + ", polarity reversed: " + this.polarity + ")";
    }

    describe() {
        return this.category + " Input " + this._id;
    }
}

export { Input, InputMode };
