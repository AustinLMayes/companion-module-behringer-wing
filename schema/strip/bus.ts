import { Strip, Main } from "./strip.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { registerAdapter } from "../parse/adapter_registry.js";
import { CompanionVariable } from "../../variables/variable-decorators.js";

class BusMode {
    constructor(public name: string) { }

    static GRP = new BusMode("GRP");
    static PRE = new BusMode("PRE");
    static POST = new BusMode("POST");

    toString() {
        return this.name;
    }

    static {
        registerAdapter(BusMode, {
            serialize: function (data: string) {
                switch (data) {
                    case "GRP":
                        return BusMode.GRP;
                    case "PRE":
                        return BusMode.PRE;
                    case "POST":
                        return BusMode.POST;
                    default:
                        throw new Error("Unknown bus mode: " + data);
                }
            },
            deserialize: function (data: BusMode) {
                return data.name;
            }
        });
    }
}

@WingObject
export class BusSend {
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
        return "BusSend (on: " + this.on + ", level: " + this.level + ", pre: " + this.pre + ")";
    }
}

@WingObject
export class Bus extends Strip {
    @WingProperty("busmono", Boolean)
    @CompanionVariable("Mono")
    mono: boolean = false;
    @WingProperty("busmode", BusMode)
    @CompanionVariable("Mode")
    mode: BusMode = BusMode.GRP;
    @WingProperty("main", Main, 4)
    @CompanionVariable("Main Send")
    mainSends: Main[]; // 4
    @WingProperty("send", BusSend, 8, key => !key.startsWith("MX"))
    @CompanionVariable("Bus Send")
    busSends: BusSend[]; // 8
    @WingProperty("send", BusSend, 8, key => key.startsWith("MX"))
    @CompanionVariable("Matrix Send")
    matrixSends: BusSend[]; // 8

    toString() {
        var str = super.toString() + " (mono: " + this.mono + ", mode: " + this.mode + ", \nmain sends: [";
        for (var i = 0; i < this.mainSends.length; i++) {
            str += "\n\t" + i + ": " + this.mainSends[i];
        }
        str += "\n], \nbus sends: [";
        for (var i = 0; i < this.busSends.length; i++) {
            str += "\n\t" + i + ": " + this.busSends[i];
        }
        str += "\n], \nmatrix sends: [";
        for (var i = 0; i < this.matrixSends.length; i++) {
            str += "\n\t" + i + ": " + this.matrixSends[i];
        }
        str += "\n])";
        return str;
    }
}