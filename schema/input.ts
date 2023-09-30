import { Named } from "./base.js";
import type { ObjectFactory } from "./base.js";
import { ObjectPropertyParser } from "./base.js";
import { WingColor } from "./color.js";

class Input extends Named {
    inputNumber: number;
    inputMode: InputMode;
    inputGain: number;
    phantomPower: boolean;
    mute: boolean;
    polarity: boolean;

    constructor(name: string, color: WingColor, icon: number, inputNumber: number, inputMode: InputMode, inputGain: number, phantomPower: boolean, mute: boolean, polarity: boolean) {
        super(name, color, icon);
        this.inputNumber = inputNumber;
        this.inputMode = inputMode;
        this.inputGain = inputGain;
        this.phantomPower = phantomPower;
        this.mute = mute;
        this.polarity = polarity;
    }

    toString() {
        return this.name + " (mode: " + this.inputMode + ", gain: " + this.inputGain + ", phantom power: " + this.phantomPower + ", mute: " + this.mute + ", polarity reversed: " + this.polarity + ")";
    }
}

enum InputMode {
    m = "MONO",
    s = "STEREO",
    ms = "MID_SIDE"
}

class InputFactory implements ObjectFactory<Input> {
    createObject(data: any): Input {
        var name = Named.NAME_PARSER.parse(data);
        var color = Named.COLOR_PARSER.parse(data);
        var icon = Named.ICON_PARSER.parse(data);
        var inputMode = InputFactory.INPUT_MODE_PARSER.parse(data);
        var inputGain = InputFactory.GAIN_PARSER.parse(data);
        var phantomPower = InputFactory.PHANTOM_POWER_PARSER.parse(data);
        var mute = InputFactory.MUTE_PARSER.parse(data);
        var polarity = InputFactory.POLARITY_PARSER.parse(data);
        return new Input(name, color, icon, data["_id"], inputMode, inputGain, phantomPower, mute, polarity);
    }

    private static readonly INPUT_MODE_PARSER = new ObjectPropertyParser<InputMode>("mode", value => {
        switch (value.toLowerCase()) {
            case "m":
                return InputMode.m;
            case "st":
                return InputMode.s;
            case "ms":
                return InputMode.ms;
            default:
                throw new Error("Invalid input mode: " + value);
        }
    }, undefined, false);
    private static readonly GAIN_PARSER = ObjectPropertyParser.float("g", NaN, true);
    private static readonly PHANTOM_POWER_PARSER = ObjectPropertyParser.boolean("vph");
    private static readonly MUTE_PARSER = ObjectPropertyParser.boolean("mute");
    private static readonly POLARITY_PARSER = ObjectPropertyParser.boolean("pol");

    static INSTANCE = new InputFactory();
}

export { Input, InputMode, InputFactory };
