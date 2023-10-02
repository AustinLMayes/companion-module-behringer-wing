import type { UserFacingObject } from "../../companion-decorators.js";
import { WingObject } from "../parse/decorators.js";
import { ChannelBase } from "./channel_base.js";

@WingObject
export class Channel extends ChannelBase implements UserFacingObject {
    describe(): string {
        if (this._id == undefined) {
            throw new Error("Channel ID not set");
        }
        return "Channel " + this._id;
    }

}