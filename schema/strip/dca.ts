import { ExposedValue, rangedNunberSelectType } from "../../companion-decorators.js";
import { Named } from "../base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";

@WingObject
export class DCA extends Named implements UserFacingObject {
    _id: number;
    @WingProperty("led", Boolean)
    @ExposedValue("Scribble Light")
    scribbleLight: boolean = false;
    @WingProperty("mute", Boolean)
    @ExposedValue("Muted")
    mute: boolean = false;
    @WingProperty("fdr", Number)
    @ExposedValue("Fader Level", rangedNunberSelectType(-144, 10), true)
    fader: number = -144;
    @WingProperty("$solo", Boolean)
    @ExposedValue("Soloed")
    solo: boolean = false;

    describe(): string {
        return "DCA " + this._id
    }

    toString() {
        return this.name + " (scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", solo: " + this.solo + ")";
    }
}
