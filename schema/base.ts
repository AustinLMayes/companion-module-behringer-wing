import { ExposedValue } from "../companion-decorators.js";
import { WingColor } from "./color.js";
import { WingProperty } from "./parse/decorators.js";

export abstract class Named {
    @WingProperty("name", String)
    @ExposedValue("Name")
    name: string = "";
    @WingProperty("col", WingColor)
    color: WingColor = WingColor.CORAL;
    @WingProperty("icon", Number)
    icon: number = 0;
}    
