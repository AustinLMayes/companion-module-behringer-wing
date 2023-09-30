import type { WingSchema } from "../schema.js";
import { Main, Send } from "./strip.js";
import type { WingColor } from "../color.js";
import type { Input } from "../input.js";
import { ChannelBase, ChannelBaseFactory } from "./channel_base.js";
import type { ObjectFactory } from "../base.js";

export class Channel extends ChannelBase {
    constructor(name: string, color: WingColor, icon: number, autoSource: boolean, manualAlt: boolean, trim: number, balance: number, mainIn: Input | null, altIn: Input | null, scribbleLight: boolean, mute: boolean, fader: number, pan: number, panWidth: number, solo: boolean, mainSends: Main[], sends: Send[]) {
        super(name, color, icon, autoSource, manualAlt, trim, balance, mainIn, altIn, scribbleLight, mute, fader, pan, panWidth, solo, mainSends, sends);
    }
}

export class ChannelFactory implements ObjectFactory<Channel> {
    createObject(data: any, schema: WingSchema | null): Channel {
        var base = ChannelBaseFactory.INSTANCE.createObject(data, schema);
        return new Channel(base.name, base.color, base.icon, base.autoSource, base.manualAlt, base.trim, base.balance, base.mainIn, base.altIn, base.scribbleLight, base.mute, base.fader, base.pan, base.panWidth, base.solo, base.mainSends, base.sends);
    }

    static readonly INSTANCE = new ChannelFactory();
}