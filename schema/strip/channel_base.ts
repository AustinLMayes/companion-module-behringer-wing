import type { WingSchema } from "../schema.js";
import type { Input } from "../input.js";
import { Main, Send, Strip, StripFactory } from "./strip.js";
import { IOCategory } from "../io.js";
import { ObjectPropertyParser } from "../base.js";
import type { WingColor } from "../color.js";

export class ChannelBase extends Strip {
    autoSource: boolean;
    manualAlt: boolean;
    mainIn: Input | null;
    altIn: Input | null;
    mainSends: Main[]; // 4
    sends: Send[]; // 16

    constructor(name: string, color: WingColor, icon: number, autoSource: boolean, manualAlt: boolean, trim: number, balance: number, mainIn: Input | null, altIn: Input | null, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, mainSends: Main[], sends: Send[]) {
        super(name, color, icon, trim, balance, scribbleLight, mute, fader, pan, panWidth, solo);
        this.autoSource = autoSource;
        this.manualAlt = manualAlt;
        this.mainIn = mainIn;
        this.altIn = altIn;
        this.mainSends = mainSends;
        this.sends = sends;
    }

    toString() {
        var str = super.toString() + " (auto source: " + this.autoSource + ", manual alt: " + this.manualAlt + ", main in: " + this.mainIn + ", alt in: " + this.altIn + ", \nmain sends: [";
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

export class ChannelBaseFactory {
    createObject(data: any, schema: WingSchema | null): ChannelBase {
        if (schema == null) {
            throw new Error("Schema must not be null");
        }
        var base = StripFactory.INSTANCE.createObject(data, schema);
        var inNode = data["in"];
        if (inNode == undefined) {
            throw new Error("Missing required property: in");
        }
        var inSetNode = inNode["set"];
        if (inSetNode == undefined) {
            throw new Error("Missing required property: in/set");
        }
        var autoSource = StripFactory.AUTO_SOURCE_PARSER.parse(inSetNode);
        var manualAlt = StripFactory.MANUAL_ALT_PARSER.parse(inSetNode);
        var inConnNode = inNode["conn"];
        if (inConnNode == undefined) {
            throw new Error("Missing required property: in/conn");
        }
        var mainIn = schema.io.findInput(IOCategory.parser("grp").parse(inConnNode), ObjectPropertyParser.integer("in", undefined, false).parse(inConnNode));
        var altIn = schema.io.findInput(IOCategory.parser("altgrp").parse(inConnNode), ObjectPropertyParser.integer("altin", undefined, false).parse(inConnNode));
        var mainSends: Main[] = [];
        var sends: Send[] = [];
        var mainNode = data["main"];
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
        for (var i = 1; i <= 16; i++) {
            var node = sendNode[i];
            if (node == undefined) {
                throw new Error("Missing required property: send/" + i);
            }
            var on = Send.SEND_ON_PARSER.parse(node);
            var level = Send.SEND_LEVEL_PARSER.parse(node);
            var pan = Send.SEND_PAN_PARSER.parse(node);
            var panWidth = Send.SEND_PAN_WIDTH_PARSER.parse(node);
            var panLink = Send.SEND_PAN_LINK_PARSER.parse(node);
            var mode = Send.SEND_MODE_PARSER.parse(node);
            sends.push(new Send(on, level, pan, panWidth, panLink, mode));
        }
        return new ChannelBase(base.name, base.color, base.icon, autoSource, manualAlt, base.trim, base.balance, mainIn, altIn, base.scribbleLight, base.mute, base.fader, base.pan, base.panWidth, base.solo, mainSends, sends);
    }

    static INSTANCE = new ChannelBaseFactory();

}