import { Strip, Main } from "./strip.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { registerAdapter } from "../parse/adapter_registry.js";
import { ExposedValue, rangedNunberSelectType, type UserFacingObject } from "../../companion-decorators.js";

class BusMode {
    constructor(public name: string) { }

    static GRP = new BusMode("GRP");
    static PRE = new BusMode("PRE");
    static POST = new BusMode("POST");

    toString() {
        return this.name;
    }

    static selectType(): object {
        return {
            type: "dropdown",
            default: "GRP",
            choices: [
                { id: "GRP", label: "Group" },
                { id: "PRE", label: "Pre Fader" },
                { id: "POST", label: "Post Fader" }
            ]
        }
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
export class BusSend implements UserFacingObject {
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
        return "BusSend (on: " + this.on + ", level: " + this.level + ", pre: " + this.pre + ")";
    }
}

@WingObject
export class Bus extends Strip implements UserFacingObject {
    @WingProperty("busmono", Boolean)
    @ExposedValue("Mono")
    mono: boolean = false;
    @WingProperty("busmode", BusMode)
    @ExposedValue("Mode", BusMode.selectType())
    mode: BusMode = BusMode.GRP;
    @WingProperty("main", Main, 4)
    @ExposedValue("Main Send")
    mainSends: Main[]; // 4
    @WingProperty("send", BusSend, 8, key => !key.startsWith("MX"))
    @ExposedValue("Bus Send")
    busSends: BusSend[]; // 8
    @WingProperty("send", BusSend, 8, key => key.startsWith("MX"))
    @ExposedValue("Matrix Send")
    matrixSends: BusSend[]; // 8

    describe() {
        return "Bus " + this._id;
    }

    postParse() {
        this.mainSends.forEach((main, i) => {
            main.description = "Bus " + this._id + " Main " + i + 1;
        });
        this.busSends.forEach((bus, i) => {
            bus.description = "Bus " + this._id + " Bus Send " + i + 1;
        });
        this.matrixSends.forEach((matrix, i) => {
            matrix.description = "Bus " + this._id + " Matrix Send " + i + 1;
        });
    }

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