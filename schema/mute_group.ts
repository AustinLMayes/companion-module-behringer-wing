import { ExposedValue, type UserFacingObject } from "../companion-decorators.js";
import { WingObject, WingProperty } from "./parse/decorators.js";

@WingObject
export class MuteGroup implements UserFacingObject {
    _id: number;
    @WingProperty("name", String)
    @ExposedValue("Name")
    name: string = "";
    @WingProperty("mute", Boolean)
    @ExposedValue("Muted")
    muted: boolean = false;

    describe(): string {
        return "Mute Group " + this._id
    }

    toString() {
        return this.name + " (muted: " + this.muted + ")";
    }

}