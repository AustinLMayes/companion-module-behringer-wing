import { Strip, StripFactory } from "./strip.js";
import { ObjectPropertyParser, type ObjectFactory } from "../base.js";
import type { WingSchema } from "../schema.js";
import type { WingColor } from "../color.js";
import type { ChannelBase } from "./channel_base.js";

export class Matrix extends Strip {
    directIns: DirectInput[]; // 2
    mono: boolean;

    constructor(name: string, color: WingColor, icon: number, trim: number, balance: number, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, directIns: DirectInput[], mono: boolean) {
        super(name, color, icon, trim, balance, scribbleLight, mute, fader, pan, panWidth, solo);
        this.directIns = directIns;
        this.mono = mono;
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

export class MatrixFactory implements ObjectFactory<Matrix> {
    createObject(data: any, schema: WingSchema | null): Matrix {
        var base = StripFactory.INSTANCE.createObject(data, schema);
        var mono = MatrixFactory.MONO_PARSER.parse(data);
        var directIns: DirectInput[] = [];
        var directInNode = data["dir"];
        if (directInNode == undefined) {
            throw new Error("Missing required property: dir");
        }
        for (var i = 1; i <= 2; i++) {
            var node = directInNode[i];
            if (node == undefined) {
                directIns.push(null as any)
                continue;
            }
            directIns.push(DirectInputFactory.INSTANCE.createObject(node, schema));
        }
        return new Matrix(base.name, base.color, base.icon, base.trim, base.balance, base.scribbleLight, base.mute, base.fader, base.pan, base.panWidth, base.solo, directIns, mono);
    }

    static readonly INSTANCE = new MatrixFactory();
    static readonly MONO_PARSER = ObjectPropertyParser.boolean("mono");
}

class DirectInput {
    on: boolean;
    level: number;
    polarityInvert: boolean;
    in: ChannelBase | null;
    tap: TapPoint;

    constructor(on: boolean, level: number, polarityInvert: boolean, in_: ChannelBase | null, tap: TapPoint) {
        this.on = on;
        this.level = level;
        this.polarityInvert = polarityInvert;
        this.in = in_;
        this.tap = tap;
    }

    toString() {
        return "DirectInput (on: " + this.on + ", level: " + this.level + ", polarityInvert: " + this.polarityInvert + ", in: " + this.in?.name + ", tap: " + this.tap + ")";
    }
}

enum TapPoint {
    PRE, POST
}

class DirectInputFactory implements ObjectFactory<DirectInput> {
    createObject(data: any, schema: WingSchema | null): DirectInput {
        if (schema == null) {
            throw new Error("Schema is null");
        }
        var on = DirectInputFactory.ON_PARSER.parse(data);
        var level = DirectInputFactory.LEVEL_PARSER.parse(data);
        var polarityInvert = DirectInputFactory.POLARITY_INVERT_PARSER.parse(data);
        var in_ = schema.getChannel(data["in"]);
        var tap = DirectInputFactory.TAP_PARSER.parse(data);
        return new DirectInput(on, level, polarityInvert, in_, tap);
    }

    static readonly INSTANCE = new DirectInputFactory();
    static readonly ON_PARSER = ObjectPropertyParser.boolean("on");
    static readonly LEVEL_PARSER = ObjectPropertyParser.float("lvl", 0, false);
    static readonly POLARITY_INVERT_PARSER = ObjectPropertyParser.boolean("inv");
    static readonly TAP_PARSER = ObjectPropertyParser.enum("tap", TapPoint, TapPoint.PRE, false);
}