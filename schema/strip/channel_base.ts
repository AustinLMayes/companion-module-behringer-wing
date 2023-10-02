import type { Input } from "../input.js";
import { Main, Send, Strip } from "./strip.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { IOCategory } from "../io.js";
import { ExposedValue, type UserFacingObject } from "../../companion-decorators.js";

@WingObject
class InputData {
    @WingProperty("grp", IOCategory)
    mainGroup: IOCategory = IOCategory.OFF;
    @WingProperty("in", Number)
    mainInput: number = 0;
    @WingProperty("altgrp", IOCategory)
    altGroup: IOCategory = IOCategory.OFF;
    @WingProperty("altin", Number)
    altInput: number = 0;

    getMain(): Input {
        throw new Error("Not implemented");
    }

    getAlt(): Input {
        throw new Error("Not implemented");
    }

    toString() {
        return "InputData (main group: " + this.mainGroup + ", main input: " + this.mainInput + ", alt group: " + this.altGroup + ", alt input: " + this.altInput + ")";
    }
}

export class ChannelBase extends Strip {
    @WingProperty("in/set/auto", Boolean)
    autoSource: boolean = false;
    @WingProperty("in/set/alt", Boolean)
    manualAlt: boolean = false;
    @WingProperty("in/conn", InputData)
    in: InputData = new InputData();
    @WingProperty("main", Main, 4)
    @ExposedValue("Main")
    mainSends: Main[];
    @WingProperty("send", Send, 16)
    @ExposedValue("Send")
    sends: Send[];

    postParse() {
        for (var i = 0; i < this.mainSends.length; i++) {
            this.mainSends[i].description = this.constructor.name + " " + this._id + " Main " + (i + 1);
        }
        for (var i = 0; i < this.sends.length; i++) {
            this.sends[i].description = this.constructor.name + " " + this._id + " Send " + (i + 1);
        }
    }

    toString() {
        var str = super.toString() + " (auto source: " + this.autoSource + ", manual alt: " + this.manualAlt + ", \ninput: " + this.in + ", \nmain sends: [";
        for (var i = 0; i < this.mainSends.length; i++) {
            str += "\n\t" + i + ": " + this.mainSends[i];
        }
        str += "\n], \nsends: [";
        for (var i = 0; i < this.sends.length; i++) {
            str += "\n\t" + i + ": " + this.sends[i];
        }
        str += "\n])";
        return str;
    }
}