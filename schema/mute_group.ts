import { WingObject, WingProperty } from "./parse/decorators.js";

@WingObject
export class MuteGroup  {
    @WingProperty("name", String)
    name: string = "";
    @WingProperty("mute", Boolean)
    muted: boolean = false;

    toString() {
        return this.name + " (muted: " + this.muted + ")";
    }

}