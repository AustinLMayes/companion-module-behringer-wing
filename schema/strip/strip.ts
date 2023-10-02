import { registerAdapter } from "../parse/adapter_registry.js";
import { Named } from "../base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { ExposedValue, rangedNunberSelectType, type UserFacingObject } from "../../companion-decorators.js";


export class Strip extends Named {
    _id: number;
    @WingProperty("in/set/trim", Number)
    @ExposedValue("Trim", rangedNunberSelectType(-18, 18), true)
    trim: number = 0;
    @WingProperty("in/set/bal", Number)
    @ExposedValue("Balance", rangedNunberSelectType(-9, 9), true)
    balance: number = 0;
    @WingProperty("led", Boolean)
    @ExposedValue("Scribble Light")
    scribbleLight: boolean = false;
    @WingProperty("mute", Boolean)
    @ExposedValue("Muted")
    mute: boolean = false;
    @WingProperty("fdr", Number)
    @ExposedValue("Fader Level", rangedNunberSelectType(-144, 10), true)
    fader: number = -144;
    @WingProperty("pan", Number)
    @ExposedValue("Pan", rangedNunberSelectType(-100, 100), true)
    pan: number = 0;
    @WingProperty("wid", Number)
    @ExposedValue("Pan Width", rangedNunberSelectType(-150, 150), true)
    panWidth: number = 0;
    @WingProperty("solo", Boolean)
    @ExposedValue("Soloed")
    solo: boolean = false;

    toString() {
        return this.name + " (trim: " + this.trim + ", balance: " + this.balance + ", scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", solo: " + this.solo + ")";
    }
}

@WingObject
export class Main implements UserFacingObject {
    description: string;
    @WingProperty("on", Boolean)
    @ExposedValue("On")
    on: boolean = false;
    @WingProperty("lvl", Number)
    @ExposedValue("Level", rangedNunberSelectType(-144, 10), true)
    level: number = 0;
    @WingProperty("pre", Boolean)
    @ExposedValue("Pre Fader")
    pre: boolean = false;

    describe(): string {
        return this.description;
    }

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

    static selectType(): object {
        return {
            type: "dropdown",
            default: "PRE",
            choices: [
                { id: "PRE", label: "Pre Fader" },
                { id: "POST", label: "Post Fader" },
                { id: "GRP", label: "Group" }
            ]
        }
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
export class Send implements UserFacingObject {
    description: string;
    @WingProperty("on", Boolean)
    @ExposedValue("On")
    on: boolean = false;
    @WingProperty("lvl", Number)
    @ExposedValue("Level", rangedNunberSelectType(-144, 10), true)
    level: number = 0;
    @WingProperty("pan", Number)
    @ExposedValue("Pan", rangedNunberSelectType(-100, 100), true)
    pan: number = 0;
    @WingProperty("wid", Number)
    @ExposedValue("Pan Width", rangedNunberSelectType(-150, 150), true)
    panWidth: number = 0;
    @WingProperty("plink", Boolean)
    @ExposedValue("Pan Link")
    panLink: boolean = false;
    @WingProperty("mode", SendMode)
    @ExposedValue("Mode", SendMode.selectType())
    mode: SendMode = SendMode.PRE;
    
    describe(): string {
        return this.description;
    }

    toString() {
        return "Send (on: " + this.on + ", level: " + this.level + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", pan link: " + this.panLink + ", mode: " + this.mode + ")";
    }
}