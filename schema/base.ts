import { WingColor } from "./color.js";

export interface ObjectFactory<T extends WingObject> {
    createObject(data: JSON): T;
}

// Base interfaces
export interface WingObject {}

export abstract class Named implements WingObject {
    name: string;
    color: WingColor;
    icon: number;

    constructor(data: any) {
        this.name = data["name"].toString();
        this.color = WingColor.fromIndex(data["col"]);
        this.icon = data["icon"];
    }
}
