import type { ObjectFactory } from "./base.js";
import { ObjectPropertyParser } from "./base.js";
import { IOCategory } from "./io.js";
import { WingSchema } from "./schema.js";
import { Input } from "./input.js";

class Output {
    outputNumber: number;
    inputGroup: IOCategory | undefined;
    inputNumber: number;

    constructor(outputNumber: number, inputGroup: IOCategory | undefined, inputNumber: number) {
        this.outputNumber = outputNumber;
        this.inputGroup = inputGroup;
        this.inputNumber = inputNumber;
    }

    toString() {
        return "Output " + this.outputNumber + " (input group: " + this.inputGroup + ", input number: " + this.inputNumber + ")";
    }

    linkedInput(schema: WingSchema): Input | undefined {
        if (this.inputGroup == undefined || this.inputGroup == IOCategory.NONE) {
            return undefined;
        }
        var inputs = schema.io.inputs.get(this.inputGroup)
        if (inputs == undefined) {
            console.error("Input group " + this.inputGroup + " not found in schema");
            return undefined;
        }
        var inputNumber = this.inputNumber;
        if (IOCategory.STEREO_SINGLE.includes(this.inputGroup)) {
            inputNumber = Math.floor((this.inputNumber - 1) / 2) + 1;
        }
        console.log("Looking for input " + inputNumber + " in " + this.inputGroup);
        if (inputNumber > inputs.length) {
            console.error("Input number " + inputNumber + " out of bounds for input group " + this.inputGroup + " (max: " + inputs.length + ")");
            return undefined;
        }
        if (this.inputGroup == IOCategory.MATRIX) {
            console.log("Available inputs: " + inputs.map(input => input.name));
        }
        return inputs.find(input => input.inputNumber == inputNumber);
    }
}

class OutputFactory implements ObjectFactory<Output> {
    createObject(data: any): Output {
        var outputNumber = data["_id"];
        var inputNumber = OutputFactory.INPUT_NUMBER_PARSER.parse(data);
        var inputGroup = OutputFactory.INPUT_GROUP_PARSER.parse(data);
        return new Output(outputNumber, inputGroup, inputNumber);
    }

    static readonly INPUT_NUMBER_PARSER = ObjectPropertyParser.integer("in", undefined, false);
    static readonly INPUT_GROUP_PARSER = IOCategory.parser("grp");

    static INSTANCE = new OutputFactory();
}

export { Output, OutputFactory };
