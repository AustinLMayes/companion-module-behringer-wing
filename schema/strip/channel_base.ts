import type { Input } from "../input.js";
import { Main, Send, Strip } from "./strip.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { IOCategory } from "../io.js";

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
    mainSends: Main[];
    @WingProperty("send", Send, 16)
    sends: Send[];

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