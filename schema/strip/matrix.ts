import { Strip } from "./strip.js";
import type { WingSchema } from "../schema.js";
import type { ChannelBase } from "./channel_base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";
import { registerAdapter } from "../parse/adapter_registry.js";
import { CompanionVariable } from "../../variables/variable-decorators.js";

class TapPoint {
    constructor(public readonly name: string) { }

    static PRE = new TapPoint("PRE");
    static POST = new TapPoint("POST");

    toString() {
        return this.name;
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
class DirectInput {
    @WingProperty("on", Boolean)
    @CompanionVariable("On")
    on: boolean = false;
    @WingProperty("lvl", Number)
    @CompanionVariable("Level")
    level: number = 0;
    @WingProperty("inv", Boolean)
    @CompanionVariable("Polarity Inverted")
    polarityInvert: boolean = false;
    @WingProperty("in", String)
    @CompanionVariable("Input")
    inRaw: string = "OFF";
    @WingProperty("tap", TapPoint)
    @CompanionVariable("Tap Point")
    tap: TapPoint = TapPoint.PRE;

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
export class Matrix extends Strip {
    @WingProperty("dir", DirectInput, 2)
    @CompanionVariable("Direct Input")
    directIns: DirectInput[];
    @WingProperty("busmono", Boolean)
    @CompanionVariable("Mono")
    mono: boolean = false;

    toString() {
        var str = super.toString() + " (mono: " + this.mono + ", \ndirect ins: [";
        for (var i = 0; i < this.directIns.length; i++) {
            str += "\n\t" + i + ": " + this.directIns[i];
        }
        str += "\n])";
        return str;
    }
}