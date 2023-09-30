import { Named } from "./base.js";
import type { Input } from "./input.js";
import type { ObjectFactory } from "./base.js";
import { ObjectPropertyParser } from "./base.js";
import { WingColor } from "./color.js";
import type { WingSchema } from "./schema.js";
import { IOCategory } from "./io.js";

export class Channel extends Named {
    autoSource: boolean;
    manualAlt: boolean;
    trim: number;
    balance: number;
    mainIn: Input | null;
    altIn: Input | null;
    scribbleLight: boolean;
    mute: boolean;
    fader: number;
    pan: number;
    panWidth: number;
    solo: boolean;
    mainSends: Main[]; // 4
    sends: Send[]; // 16

    constructor(name: string, color: WingColor, icon: number, autoSource: boolean, manualAlt: boolean, trim: number, balance: number, mainIn: Input | null, altIn: Input | null, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, mainSends: Main[], sends: Send[]) {
        super(name, color, icon);
        this.autoSource = autoSource;
        this.manualAlt = manualAlt;
        this.trim = trim;
        this.balance = balance;
        this.mainIn = mainIn;
        this.altIn = altIn;
        this.scribbleLight = scribbleLight;
        this.mute = mute;
        this.fader = fader;
        this.pan = pan;
        this.panWidth = panWidth;
        this.solo = solo;
        this.mainSends = mainSends;
        this.sends = sends;
    }

    toString() {
        var res = "";
        res += this.name + " (auto source: " + this.autoSource + ", manual alt: " + this.manualAlt + ", trim: " + this.trim + ", balance: " + this.balance + ", scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", solo: " + this.solo;
        res += "\n\tMain sends: ";
        var i = 1;
        this.mainSends.forEach(send => {
            res += "\n\t\t" + i + ": " + send.toString();
            i++;
        });
        res += "\n\tSends: ";
        i = 1;
        this.sends.forEach(send => {
            res += "\n\t\t" + i + ": " + send.toString();
            i++;
        });
        res += ")";
        return res;
    }
}

export class ChannelFactory implements ObjectFactory<Channel> {
    createObject(data: any, schema: WingSchema | null): Channel {
        if (schema == null) {
            throw new Error("Schema must not be null");
        }
        var name = Named.NAME_PARSER.parse(data);
        var color = Named.COLOR_PARSER.parse(data);
        var icon = Named.ICON_PARSER.parse(data);
        var inNode = data["in"];
        if (inNode == undefined) {
            throw new Error("Missing required property: in");
        }
        var inSetNode = inNode["set"];
        if (inSetNode == undefined) {
            throw new Error("Missing required property: in/set");
        }
        var autoSource = ChannelFactory.AUTO_SOURCE_PARSER.parse(inSetNode);
        var manualAlt = ChannelFactory.MANUAL_ALT_PARSER.parse(inSetNode);
        var trim = ChannelFactory.TRIM_PARSER.parse(inSetNode);
        var balance = ChannelFactory.BALANCE_PARSER.parse(inSetNode);
        var inConnNode = inNode["conn"];
        if (inConnNode == undefined) {
            throw new Error("Missing required property: in/conn");
        }
        var mainIn = schema.io.findInput(IOCategory.parser("grp").parse(inConnNode), ObjectPropertyParser.integer("in", undefined, false).parse(inConnNode));
        var altIn = schema.io.findInput(IOCategory.parser("altgrp").parse(inConnNode), ObjectPropertyParser.integer("altin", undefined, false).parse(inConnNode));
        var scribbleLight = ChannelFactory.SCRIBBLE_LIGHT_PARSER.parse(data);
        var mute = ChannelFactory.MUTE_PARSER.parse(data);
        var fader = ChannelFactory.FADER_PARSER.parse(data);
        var pan = ChannelFactory.PAN_PARSER.parse(data);
        var panWidth = ChannelFactory.PAN_WIDTH_PARSER.parse(data);
        var solo = ChannelFactory.SOLO_PARSER.parse(data);
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
        return new Channel(name, color, icon, autoSource, manualAlt, trim, balance, mainIn, altIn, scribbleLight, mute, fader, pan, panWidth, solo, mainSends, sends);
    }

    static INSTANCE = new ChannelFactory();
    static readonly AUTO_SOURCE_PARSER = ObjectPropertyParser.boolean("srcauto");
    static readonly MANUAL_ALT_PARSER = ObjectPropertyParser.boolean("altsrc");
    static readonly TRIM_PARSER = ObjectPropertyParser.float("trim", 0, true);
    static readonly BALANCE_PARSER = ObjectPropertyParser.float("bal", 0, true);
    static readonly SCRIBBLE_LIGHT_PARSER = ObjectPropertyParser.boolean("led");
    static readonly MUTE_PARSER = ObjectPropertyParser.boolean("mute");
    static readonly FADER_PARSER = ObjectPropertyParser.float("fdr", -144, true);
    static readonly PAN_PARSER = ObjectPropertyParser.float("pan", 0, true);
    static readonly PAN_WIDTH_PARSER = ObjectPropertyParser.float("width", 0, true);
    static readonly SOLO_PARSER = ObjectPropertyParser.boolean("$solo");
}


class Main {
    on: boolean;
    level: number;

    constructor(on: boolean, level: number) {
        this.on = on;
        this.level = level;
    }

    toString() {
        return "Main (on: " + this.on + ", level: " + this.level + ")";
    }

    static readonly MAIN_ON_PARSER = ObjectPropertyParser.boolean("on");
    static readonly MAIN_LEVEL_PARSER = ObjectPropertyParser.float("lvl", 0, true);
}

class Send {
    on: boolean;
    level: number;
    pan: number;
    panWidth: number;
    panLink: boolean;
    mode: SendMode;

    constructor(on: boolean, level: number, pan: number, panWidth: number, panLink: boolean, mode: SendMode) {
        this.on = on;
        this.level = level;
        this.pan = pan;
        this.panWidth = panWidth;
        this.panLink = panLink;
        this.mode = mode;
    }
    
    toString() {
        return "Send (on: " + this.on + ", level: " + this.level + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", pan link: " + this.panLink + ", mode: " + this.mode + ")";
    }

    static readonly SEND_ON_PARSER = ObjectPropertyParser.boolean("on");
    static readonly SEND_LEVEL_PARSER = ObjectPropertyParser.float("lvl", 0, true);
    static readonly SEND_PAN_PARSER = ObjectPropertyParser.float("pan", 0, true);
    static readonly SEND_PAN_WIDTH_PARSER = ObjectPropertyParser.float("wid", 0, true);
    static readonly SEND_PAN_LINK_PARSER = ObjectPropertyParser.boolean("plink");
    static readonly SEND_MODE_PARSER = new ObjectPropertyParser<SendMode>("mode", value => {
        switch (value.toLowerCase()) {
            case "pre":
                return SendMode.PRE;
            case "post":
                return SendMode.POST;
            case "grp":
                return SendMode.GRP;
            default:
                throw new Error("Invalid send mode: " + value);
        }
    }, undefined, false);
}

enum SendMode {
    PRE, POST, GRP
}