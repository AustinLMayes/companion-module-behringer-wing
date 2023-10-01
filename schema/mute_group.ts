import { CompanionVariable } from "../variables/variable-decorators.js";
import { WingObject, WingProperty } from "./parse/decorators.js";

@WingObject
export class MuteGroup  {
    @WingProperty("name", String)
    @CompanionVariable("Name")
    name: string = "";
    @WingProperty("mute", Boolean)
    @CompanionVariable("Muted")
    muted: boolean = false;

    toString() {
        return this.name + " (muted: " + this.muted + ")";
    }

}