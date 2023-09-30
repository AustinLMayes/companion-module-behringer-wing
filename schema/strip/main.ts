import type { WingColor } from "../color.js";
import { ObjectPropertyParser, type ObjectFactory } from "../base.js";
import { BusSendFactory, type BusSend } from "./bus.js";
import { Strip, StripFactory } from "./strip.js";
import type { WingSchema } from "../schema.js";

export class Main extends Strip {
    mono: boolean;
    matrixSends: BusSend[]; // 8

    constructor(name: string, color: WingColor, icon: number, mono: boolean, trim: number, balance: number, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, matrixSends: BusSend[]) {
        super(name, color, icon, trim, balance, scribbleLight, mute, fader, pan, panWidth, solo);
        this.mono = mono;
        this.matrixSends = matrixSends;
    }

    toString() {
        var str = super.toString() + " (mono: " + this.mono + ", \nmatrix sends: [";
        for (var i = 0; i < this.matrixSends.length; i++) {
            str += "\n\t" + i + ": " + this.matrixSends[i];
        }
        str += "\n])";
        return str;
    }
}

export class MainFactory implements ObjectFactory<Main> {
    createObject(data: any, schema: WingSchema | null): Main {
        var base = StripFactory.INSTANCE.createObject(data, schema);
        var mono = MainFactory.MONO_PARSER.parse(data);
        var matrixSends: BusSend[] = [];
        var matrixNode = data["send"];
        if (matrixNode == undefined) {
            throw new Error("Missing required property: send");
        }
        for (var i = 1; i <= 8; i++) {
            var name = "MX" + i;
            var node = matrixNode[name];
            if (node == undefined) {
                throw new Error("Missing required property: sends/" + name);
            }
            matrixSends.push(BusSendFactory.INSTANCE.createObject(node, schema));
        }
        return new Main(base.name, base.color, base.icon, mono, base.trim, base.balance, base.scribbleLight, base.mute, base.fader, base.pan, base.panWidth, base.solo, matrixSends);
    }

    static readonly INSTANCE = new MainFactory();
    static readonly MONO_PARSER = ObjectPropertyParser.boolean("busmono");
}