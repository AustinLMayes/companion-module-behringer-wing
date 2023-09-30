import type { Input } from "../input.js";
import { WingColor } from "../color.js";
import type { WingSchema } from "../schema.js";
import { Strip, StripFactory, Main, Send } from "./strip.js";

export class Channel extends Strip {
    constructor(name: string, color: WingColor, icon: number, autoSource: boolean, manualAlt: boolean, trim: number, balance: number, mainIn: Input | null, altIn: Input | null, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, mainSends: Main[], sends: Send[]) {
        super(name, color, icon, autoSource, manualAlt, trim, balance, mainIn, altIn, scribbleLight, mute, fader, pan, panWidth, solo, mainSends, sends);
    }
}

export class ChannelFactory extends StripFactory<Channel> {
    createObject(data: any, schema: WingSchema | null): Channel {
        var base = super.createObject(data, schema);
        return new Channel(base.name, base.color, base.icon, base.autoSource, base.manualAlt, base.trim, base.balance, base.mainIn, base.altIn, base.scribbleLight, base.mute, base.fader, base.pan, base.panWidth, base.solo, base.mainSends, base.sends);
    }
}