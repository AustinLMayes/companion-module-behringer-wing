import { ObjectPropertyParser } from "./base.js";

export class IOCategory {
    jsonName: string;
    maxInputs: number;

    constructor(jsonName: string, maxInputs: number) {
        this.jsonName = jsonName;
        this.maxInputs = maxInputs;
    }

    toString() {
        return this.jsonName;
    }

    static readonly NONE = new IOCategory("OFF", 0);
    static readonly LOCAL = new IOCategory("LCL", 8);
    static readonly AUXILIARY = new IOCategory("AUX", 8);
    static readonly AES_A = new IOCategory("A", 48);
    static readonly AES_B = new IOCategory("B", 48); 
    static readonly AES_C = new IOCategory("C", 48);
    static readonly STAGE_CONNECT = new IOCategory("SC", 32);
    static readonly USB = new IOCategory("USB", 48);
    static readonly CARD = new IOCategory("CRD", 64);
    static readonly MODULE = new IOCategory("MOD", 64);
    static readonly AES_EBU = new IOCategory("AES", 2);
    static readonly USER_SIGNAL = new IOCategory("USR", 24);
    static readonly OSCELATOR = new IOCategory("OSC", 2);
    static readonly BUS = new IOCategory("$BUS", 24);
    static readonly MAIN = new IOCategory("$MAIN", 8);
    static readonly MATRIX = new IOCategory("$MTX", 16);
    static readonly FX_SEND = new IOCategory("$SEND", 32);
    static readonly MONITOR = new IOCategory("$MON", 4);

    // All categories
    static readonly ALL = [
        IOCategory.LOCAL,
        IOCategory.AUXILIARY,
        IOCategory.AES_A,
        IOCategory.AES_B,
        IOCategory.AES_C,
        IOCategory.STAGE_CONNECT,
        IOCategory.USB,
        IOCategory.CARD,
        IOCategory.MODULE,
        IOCategory.AES_EBU,
        IOCategory.USER_SIGNAL,
        IOCategory.OSCELATOR,
        IOCategory.BUS,
        IOCategory.MAIN,
        IOCategory.MATRIX,
        IOCategory.FX_SEND,
        IOCategory.MONITOR
    ];

    static readonly STEREO_SINGLE = [
        IOCategory.USER_SIGNAL,
        IOCategory.OSCELATOR,
        IOCategory.BUS,
        IOCategory.MAIN,
        IOCategory.MATRIX,
        IOCategory.FX_SEND,
        IOCategory.MONITOR
    ];

    static parser(jsonName: string): ObjectPropertyParser<IOCategory> {
        return new ObjectPropertyParser(jsonName, value => {
            if (value == "OFF") {
                return IOCategory.NONE;
            }
            var res = IOCategory.ALL.filter(category => category.jsonName.replaceAll("$", "") == value)[0];
            if (res != undefined) {
                return res;
            }
            throw new Error("Invalid IO category: " + value);
        }, undefined, false);
    }
}