import { CompanionVariable } from "../../variables/variable-decorators.js";
import { Named } from "../base.js";
import { WingObject, WingProperty } from "../parse/decorators.js";

@WingObject
export class DCA extends Named {
    @WingProperty("led", Boolean)
    @CompanionVariable("Scribble Light")
    scribbleLight: boolean = false;
    @WingProperty("mute", Boolean)
    @CompanionVariable("Muted")
    mute: boolean = false;
    @WingProperty("fdr", Number)
    @CompanionVariable("Fader Level")
    fader: number = -144;
    @WingProperty("$solo", Boolean)
    @CompanionVariable("Soloed")
    solo: boolean = false;

    toString() {
        return this.name + " (scribble light: " + this.scribbleLight + ", mute: " + this.mute + ", fader: " + this.fader + ", solo: " + this.solo + ")";
    }
}
