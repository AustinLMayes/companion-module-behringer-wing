import { Named } from "./base.js";
import type { ObjectFactory } from "./base.js";

class Input extends Named {
    inputMode: InputMode;
    inputGain: number;
    phantomPower: boolean;
    mute: boolean;
    polarity: boolean;

    constructor(data: any) {
        super(data);
        this.inputMode = data["mode"];
        this.inputGain = data["g"];
        this.phantomPower = data["vph"] == 1;
        this.mute = data["mute"] == 1;
        this.polarity = data["pol"] == 1;
    }
}

enum InputMode {
    m = "MONO",
    s = "STEREO",
    ms = "MID_SIDE"
}

class InputFactory implements ObjectFactory<Input> {
    createObject(data: any): Input {
        var mode: InputMode;
        switch (data["mode"].toLowerCase()) {
            case "m":
                mode = InputMode.m;
                break;
            case "st":
                mode = InputMode.s;
                break;
            case "m/s":
                mode = InputMode.ms;
                break;
            default:
                throw new Error("Invalid input mode: " + data["mode"]);
        }
        return {
            name: data["name"],
            color: data["col"],
            icon: data["icon"],
            inputMode: mode,
            inputGain: data["g"],
            phantomPower: data["vph"] == 1,
            mute: data["mute"] == 1,
            polarity: data["pol"] == 1
        };
    }
}

export { Input, InputMode, InputFactory };
