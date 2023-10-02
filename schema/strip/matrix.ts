import { Strip } from "./strip.js";
import type { WingSchema } from "../schema.js";
import type { ChannelBase } from "./channel_base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { registerAdapter } from "../parse/adapter_registry.js";
import { ExposedValue, rangedNunberSelectType, type UserFacingObject } from "../../companion-decorators.js";

class TapPoint {
    constructor(public readonly name: string) { }

    static PRE = new TapPoint("PRE");
    static POST = new TapPoint("POST");

    toString() {
        return this.name;
    }

    static selectType(): object {
        return {
            type: "dropdown",
            default: "PRE",
            choices: [
                { id: "PRE", label: "Pre Fader" },
                { id: "POST", label: "Post Fader" }
            ]
        }
    }

    static {
        registerAdapter(TapPoint, {
            serialize: function (data: string) {
                switch (data) {
                    case "PRE":
                        return TapPoint.PRE;
                    case "POST":
                        return TapPoint.POST;
                    default:
                        throw new Error("Unknown tap point: " + data);
                }
            },
            deserialize: function (data: TapPoint) {
                return data.name;
            }
        });
    }
}

@WingObject
class DirectInput implements UserFacingObject {
    description: string;
    @WingProperty("on", Boolean)
    @ExposedValue("On")
    on: boolean = false;
    @WingProperty("lvl", Number)
    @ExposedValue("Level", rangedNunberSelectType(-144, 10), true)
    level: number = 0;
    @WingProperty("inv", Boolean)
    @ExposedValue("Polarity Inverted")
    polarityInvert: boolean = false;
    @WingProperty("in", String)
    @ExposedValue("Input")
    inRaw: string = "OFF";
    @WingProperty("tap", TapPoint)
    @ExposedValue("Tap Point", TapPoint.selectType())
    tap: TapPoint = TapPoint.PRE;

    describe(): string {
        return this.description;
    }

    getIn(schema: WingSchema | null): ChannelBase | null {
        if (schema == null) {
            throw new Error("Schema is null");
        }
        if (this.inRaw == "OFF") {
            return null;
        }
        return schema.getChannel(this.inRaw);
    }

    toString() {
        return "DirectInput (on: " + this.on + ", level: " + this.level + ", polarityInvert: " + this.polarityInvert + ", in: " + this.inRaw + ", tap: " + this.tap + ")";
    }
}

@WingObject
export class Matrix extends Strip implements UserFacingObject {
    @WingProperty("dir", DirectInput, 2)
    @ExposedValue("Direct Input")
    directIns: DirectInput[];
    @WingProperty("busmono", Boolean)
    @ExposedValue("Mono")
    mono: boolean = false;

    describe(): string {
        return "Matrix " + this._id;
    }

    postParse() {
        this.directIns.forEach((direct, i) => {
            direct.description = "Matrix " + this._id + " Direct Input " + i + 1;
        });
    }

    toString() {
        var str = super.toString() + " (mono: " + this.mono + ", \ndirect ins: [";
        for (var i = 0; i < this.directIns.length; i++) {
            str += "\n\t" + i + ": " + this.directIns[i];
        }
        str += "\n])";
        return str;
    }
}