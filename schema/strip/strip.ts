import type { WingSchema } from "../schema.js";
import { Named, ObjectPropertyParser } from "../base.js";
import { WingColor } from "../color.js";


export class Strip extends Named {
    
    trim: number;
    balance: number;
    scribbleLight: boolean;
    mute: boolean;
    fader: number;
    pan: number;
    panWidth: number;
    solo: boolean;

    constructor(name: string, color: WingColor, icon: number, trim: number, balance: number, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean) {
        super(name, color, icon);
        this.trim = trim;
        this.balance = balance;
        this.scribbleLight = scribbleLight;
        this.mute = mute;
        this.fader = fader;
        this.pan = pan;
        this.panWidth = panWidth;
        this.solo = solo;
    }

    toString() {
        return this.name + " (trim: " + this.trim + ", balance: " + this.balance + ", scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", solo: " + this.solo + ")";
    }
}

export class StripFactory {
    createObject(data: any, schema: WingSchema | null): Strip {
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
        var trim = StripFactory.TRIM_PARSER.parse(inSetNode);
        var balance = StripFactory.BALANCE_PARSER.parse(inSetNode);
        var scribbleLight = StripFactory.SCRIBBLE_LIGHT_PARSER.parse(data);
        var mute = StripFactory.MUTE_PARSER.parse(data);
        var fader = StripFactory.FADER_PARSER.parse(data);
        var pan = StripFactory.PAN_PARSER.parse(data);
        var panWidth = StripFactory.PAN_WIDTH_PARSER.parse(data);
        var solo = StripFactory.SOLO_PARSER.parse(data);
        return new Strip(name, color, icon, trim, balance, scribbleLight, mute, fader, pan, panWidth, solo);
    }

    static INSTANCE = new StripFactory();
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

export class Main {
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

export class Send {
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
        return "Send (on: " + this.on + ", level: " + this.level + ", pan: " + this.pan + ", pan width: " + this.panWidth + ", pan link: " + this.panLink + ", mode: " + SendMode[this.mode] + ")";
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