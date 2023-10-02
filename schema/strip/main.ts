import type { WingColor } from "../color.js";
import { BusSend } from "./bus.js";
import { Strip } from "./strip.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { ExposedValue, type UserFacingObject } from "../../companion-decorators.js";

@WingObject
export class Main extends Strip implements UserFacingObject {
    @WingProperty("busmono", Boolean)
    @ExposedValue("Mono")
    mono: boolean = false;
    @WingProperty("send", BusSend, 8, key => key.startsWith("MX"))
    @ExposedValue("Matrix Send")
    matrixSends: BusSend[]; // 8

    describe() {
        return "Main " + this._id;
    }

    postParse() {
        this.matrixSends.forEach((matrix, i) => {
            matrix.description = "Main " + this._id + " Matrix Send " + i + 1;
        });
    }

    toString() {
        var str = super.toString() + " (mono: " + this.mono + ", \nmatrix sends: [";
        for (var i = 0; i < this.matrixSends.length; i++) {
            str += "\n\t" + i + ": " + this.matrixSends[i];
        }
        str += "\n])";
        return str;
    }
}