import { registerAdapter } from "../parse/adapter_registry.js";
import { Named } from "../base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { CompanionVariable } from "../../variables/variable-decorators.js";


export class Strip extends Named {
    @WingProperty("in/set/trim", Number)
    @CompanionVariable("Trim")
    trim: number = 0;
    @WingProperty("in/set/bal", Number)
    @CompanionVariable("Balance")
    balance: number = 0;
    @WingProperty("led", Boolean)
    @CompanionVariable("Scribble Light")
    scribbleLight: boolean = false;
    @WingProperty("mute", Boolean)
    @CompanionVariable("Muted")
    mute: boolean = false;
    @WingProperty("fdr", Number)
    @CompanionVariable("Fader Level")
    fader: number = -144;
    @WingProperty("pan", Number)
    @CompanionVariable("Pan")
    pan: number = 0;
    @WingProperty("wid", Number)
    @CompanionVariable("Pan Width")
    panWidth: number = 0;
    @WingProperty("solo", Boolean)
    @CompanionVariable("Soloed")
    solo: boolean = false;

    toString() {
        return this.name + " (trim: " + this.trim + ", balance: " + this.balance + ", scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", solo: " + this.solo + ")";
    }
}

@WingObject
export class Main {
    @WingProperty("on", Boolean)
    @CompanionVariable("On")
    on: boolean = false;
    @WingProperty("lvl", Number)
    @CompanionVariable("Level")
    level: number = 0;
    @WingProperty("pre", Boolean)
    @CompanionVariable("Pre Fader")
    pre: boolean = false;

    toString() {
        return "Main (on: " + this.on + ", level: " + this.level + ", pre: " + this.pre + ")";
    }
}

class SendMode {
    constructor(public readonly name: string) { }

    static PRE = new SendMode("PRE");
    static POST = new SendMode("POST");
    static GRP = new SendMode("GRP");

    toString() {
        return this.name;
    }

    static {
        registerAdapter(SendMode, {
            serialize: function (data: string) {
                switch (data) {
                    case "PRE":
                        return SendMode.PRE;
                    case "POST":
                        return SendMode.POST;
                    case "GRP":
                        return SendMode.GRP;
                    default:
                        throw new Error("Unknown send mode: " + data);
                }
            },
            deserialize: function (data: SendMode) {
                return data.name;
            }
        });
    }
}

@WingObject
export class Send {
    @WingProperty("on", Boolean)
    @CompanionVariable("On")
    on: boolean = false;
    @WingProperty("lvl", Number)
    @CompanionVariable("Level")
    level: number = 0;
    @WingProperty("pan", Number)
    @CompanionVariable("Pan")
    pan: number = 0;
    @WingProperty("wid", Number)
    @CompanionVariable("Pan Width")
    panWidth: number = 0;
    @WingProperty("plink", Boolean)
    @CompanionVariable("Pan Link")
    panLink: boolean = false;
    @WingProperty("mode", SendMode)
    @CompanionVariable("Mode")
    mode: SendMode = SendMode.PRE;
    
    toString() {
        return "Send (on: " + this.on + ", level: " + this.level + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", pan link: " + this.panLink + ", mode: " + this.mode + ")";
    }
}