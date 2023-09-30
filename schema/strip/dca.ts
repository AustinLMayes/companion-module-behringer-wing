import type { WingSchema } from "../schema.js";
import { Named, type ObjectFactory } from "../base.js";
import type { WingColor } from "../color.js";
import { Strip, StripFactory } from "./strip.js";

export class DCA extends Named {
    scribbleLight: boolean;
    mute: boolean;
    fader: number;
    solo: boolean;

    constructor(name: string, color: WingColor, icon: number, scribbleLight: boolean, mute: boolean, fader: number, solo: boolean) {
        super(name, color, icon);
        this.scribbleLight = scribbleLight;
        this.mute = mute;
        this.fader = fader;
        this.solo = solo;
    }

    toString() {
        return this.name + " (scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", solo: " + this.solo + ")";
    }
}

export class DCAFactory implements ObjectFactory<DCA> {
    createObject(data: any, schema: WingSchema | null): DCA {
        var name = Named.NAME_PARSER.parse(data);
        var color = Named.COLOR_PARSER.parse(data);
        var icon = Named.ICON_PARSER.parse(data);
        var scribbleLight = StripFactory.SCRIBBLE_LIGHT_PARSER.parse(data);
        var mute = StripFactory.MUTE_PARSER.parse(data);
        var fader = StripFactory.FADER_PARSER.parse(data);
        var solo = StripFactory.SOLO_PARSER.parse(data);
        return new DCA(name, color, icon, scribbleLight, mute, fader, solo);
    }

    static readonly INSTANCE = new DCAFactory();
}
