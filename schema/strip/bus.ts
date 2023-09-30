import type { WingSchema } from "../schema.js";
import { ObjectPropertyParser } from "../base.js";
import type { ObjectFactory } from "../base.js";
import { Strip, Main, StripFactory } from "./strip.js";
import type { WingColor } from "../color.js";

export class Bus extends Strip {
    mono: boolean;
    mode: BusMode;
    mainSends: Main[]; // 4
    busSends: BusSend[]; // 8
    matrixSends: BusSend[]; // 8

    constructor(name: string, color: WingColor, icon: number, mono: boolean, mode: BusMode, trim: number, balance: number, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, mainSends: Main[], busSends: BusSend[], matrixSends: BusSend[]) {
        super(name, color, icon, trim, balance, scribbleLight, mute, fader, pan, panWidth, solo);
        this.mono = mono;
        this.mode = mode;
        this.mainSends = mainSends;
        this.busSends = busSends;
        this.matrixSends = matrixSends;
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

enum BusMode {
    PRE, POST, GRP
}

export class BusFactory implements ObjectFactory<Bus> {
    createObject(data: any, schema: WingSchema | null): Bus {
        var base = StripFactory.INSTANCE.createObject(data, schema);
        var mono = BusFactory.MONO_PARSER.parse(data);
        var mode = BusFactory.MODE_PARSER.parse(data);
        var mainSends: Main[] = [];
        var busSends: BusSend[] = [];
        var matrixSends: BusSend[] = [];
        var mainNode = data["main"];
        if (mainNode == undefined) {
            throw new Error("Missing required property: main");
        }
        for (var i = 1; i <= 4; i++) {
            var node = mainNode[i];
            if (node == undefined) {
                throw new Error("Missing required property: main/" + i);
            }
            var on = Main.MAIN_ON_PARSER.parse(node);
            var level = Main.MAIN_LEVEL_PARSER.parse(node);
            mainSends.push(new Main(on, level));
        }
        var sendNode = data["send"];
        if (sendNode == undefined) {
            throw new Error("Missing required property: send");
        }
        for (var i = 1; i <= 8; i++) {
            var node = sendNode[i];
            if (node == undefined) {
                throw new Error("Missing required property: send/" + i);
            }
            var on = BusSend.BUS_SEND_ON_PARSER.parse(node);
            var level = BusSend.BUS_SEND_LEVEL_PARSER.parse(node);
            var pre = BusSend.BUS_SEND_PRE_PARSER.parse(node);
            busSends.push(new BusSend(on, level, pre));
        }
        for (var i = 1; i <= 8; i++) {
            var name = "MX" + i;
            var node = sendNode[name];
            if (node == undefined) {
                throw new Error("Missing required property: send/" + name);
            }
            var on = BusSend.BUS_SEND_ON_PARSER.parse(node);
            var level = BusSend.BUS_SEND_LEVEL_PARSER.parse(node);
            var pre = BusSend.BUS_SEND_PRE_PARSER.parse(node);
            matrixSends.push(new BusSend(on, level, pre));
        }
        return new Bus(base.name, base.color, base.icon, mono, mode, base.trim, base.balance, base.scribbleLight, base.mute, base.fader, base.pan, base.panWidth, base.solo, mainSends, busSends, matrixSends);
    }

    static readonly INSTANCE = new BusFactory();
    static readonly MONO_PARSER = ObjectPropertyParser.boolean("busmono");
    static readonly MODE_PARSER = ObjectPropertyParser.enum("busmode", BusMode, undefined, false);
}

class BusSend {
    on: boolean;
    level: number;
    pre: boolean;

    constructor(on: boolean, level: number, pre: boolean) {
        this.on = on;
        this.level = level;
        this.pre = pre;
    }

    toString() {
        return "BusSend (on: " + this.on + ", level: " + this.level + ", pre: " + this.pre + ")";
    }

    static readonly BUS_SEND_ON_PARSER = ObjectPropertyParser.boolean("on");
    static readonly BUS_SEND_LEVEL_PARSER = ObjectPropertyParser.float("lvl", 0, false);
    static readonly BUS_SEND_PRE_PARSER = ObjectPropertyParser.boolean("pre");
}