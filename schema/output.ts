import { IOCategory } from "./io.js";
import { WingSchema } from "./schema.js";
import { Input } from "./input.js";
import { WingObject, WingProperty } from "./parse/decorators.js";

@WingObject
class Output {
    @WingProperty("grp", IOCategory)
    inputGroup: IOCategory | null = null;
    @WingProperty("in", Number) 
    inputNumber: number = 0;

    toString() {
        return "Output" + " (input group: " + this.inputGroup + ", input number: " + this.inputNumber + ")";
    }

    linkedInput(schema: WingSchema): Input | null {
        if (this.inputGroup == undefined || this.inputGroup == IOCategory.OFF) {
            return null;
        }
        return schema.io.findInput(this.inputGroup, this.inputNumber);
    }
}

export { Output };
