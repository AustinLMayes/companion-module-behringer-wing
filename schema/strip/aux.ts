import type { UserFacingObject } from "../../companion-decorators.js";
import { WingObject } from "../parse/decorators.js";
import { ChannelBase } from "./channel_base.js";

@WingObject
export class Aux extends ChannelBase implements UserFacingObject {
    describe(): string {
        return "Aux " + this._id;
    }
    
}