import { WingColor } from "./color.js";

export interface ObjectFactory<T extends WingObject> {
    createObject(data: any): T;
}

export class ObjectPropertyParser<T> {
    jsonName: string;
    parser: (value: any) => T;
    defaultValue: T | undefined;
    defaultAllowed: boolean;

    constructor(jsonName: string, parser: (value: any) => T, defaultValue: T | undefined, defaultAllowed: boolean) {
        this.jsonName = jsonName;
        this.parser = parser;
        this.defaultValue = defaultValue;
        this.defaultAllowed = defaultAllowed;
    }

    parse(data: any): any {
        var value: any = data[this.jsonName];
        if (value == undefined) {
            if (this.defaultValue == undefined) {
                throw new Error("Missing required property: " + this.jsonName + " in data: " + data);
            }
            if (!this.defaultAllowed) {
                throw new Error("Missing required property: " + this.jsonName + " in data: " + data);
            }
            value = this.defaultValue;
        }
        return this.parser(value);
    }

    // Default parsers

    static boolean(jsonName: string): ObjectPropertyParser<boolean> {
        return new ObjectPropertyParser(jsonName, value => {
            return value == 1;
        }, false, true);
    }

    static integer(jsonName: string, defaultValue: number | undefined, defaultAllowed: boolean): ObjectPropertyParser<number> {
        return new ObjectPropertyParser(jsonName, value => {
            return parseInt(value);
        }, defaultValue, defaultAllowed);
    }

    static float(jsonName: string, defaultValue: number | undefined, defaultAllowed: boolean): ObjectPropertyParser<number> {
        return new ObjectPropertyParser(jsonName, value => {
            return parseFloat(value);
        }, defaultValue, defaultAllowed);
    }

    static string(jsonName: string, defaultValue: string | undefined, defaultAllowed: boolean): ObjectPropertyParser<string> {
        return new ObjectPropertyParser(jsonName, value => {
            return value;
        }, defaultValue, defaultAllowed);
    }

    static color(jsonName: string, defaultValue: WingColor | undefined, defaultAllowed: boolean): ObjectPropertyParser<WingColor> {
        return new ObjectPropertyParser(jsonName, value => {
            return WingColor.fromIndex(value);
        }, defaultValue, defaultAllowed);
    }

    static enum<T>(jsonName: string, enumType: any, defaultValue: T | undefined, defaultAllowed: boolean): ObjectPropertyParser<T> {
        return new ObjectPropertyParser(jsonName, value => {
            return enumType[value];
        }, defaultValue, defaultAllowed);
    }
}

// Base interfaces
export interface WingObject {}

export abstract class Named implements WingObject {
    name: string;
    color: WingColor;
    icon: number;

    constructor(name: string, color: WingColor, icon: number) {
        this.name = name;
        this.color = color;
        this.icon = icon;
    }

    static NAME_PARSER = ObjectPropertyParser.string("name", undefined, false);
    static COLOR_PARSER = ObjectPropertyParser.color("col", undefined, false);
    static ICON_PARSER = ObjectPropertyParser.integer("icon", undefined, false);
}
