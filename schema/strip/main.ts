import type { WingColor } from "../color.js";
import { BusSend } from "./bus.js";
import { Strip } from "./strip.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { CompanionVariable } from "../../variables/variable-decorators.js";

@WingObject
export class Main extends Strip {
    @WingProperty("busmono", Boolean)
    @CompanionVariable("Mono")
    mono: boolean = false;
    @WingProperty("send", BusSend, 8, key => key.startsWith("MX"))
    @CompanionVariable("Matrix Send")
    matrixSends: BusSend[]; // 8

    toString() {
        var str = super.toString() + " (mono: " + this.mono + ", \nmatrix sends: [";
        for (var i = 0; i < this.matrixSends.length; i++) {
            str += "\n\t" + i + ": " + this.matrixSends[i];
        }
        str += "\n])";
        return str;
    }
}