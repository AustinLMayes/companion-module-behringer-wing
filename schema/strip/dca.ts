import { Named } from "../base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";

@WingObject
export class DCA extends Named {
    @WingProperty("led", Boolean)
    scribbleLight: boolean = false;
    @WingProperty("mute", Boolean)
    mute: boolean = false;
    @WingProperty("fdr", Number)
    fader: number = -144;
    @WingProperty("$solo", Boolean)
    solo: boolean = false;

    toString() {
        return this.name + " (scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", solo: " + this.solo + ")";
    }
}
