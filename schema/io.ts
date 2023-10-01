import { registerAdapter } from "./parse/adapter_registry.js";

export class IOCategory {
    constructor(public readonly code: string) {}

    static OFF = new IOCategory("OFF");
    static LOCAL = new IOCategory("LCL");
    static AUX = new IOCategory("AUX");
    static AES_A = new IOCategory("A");
    static AES_B = new IOCategory("B");
    static AES_C = new IOCategory("C");
    static STAGE_CONNECT = new IOCategory("SC");
    static USB = new IOCategory("USB");
    static CARD = new IOCategory("CRD");
    static MODULE = new IOCategory("MOD");
    static AES = new IOCategory("AES");
    static USER = new IOCategory("USR");
    static OSCOLATOR = new IOCategory("OSC");
    static BUS = new IOCategory("BUS");
    static MAIN = new IOCategory("MAIN");
    static MATRIX = new IOCategory("MTX");
    static SEND = new IOCategory("SEND");
    static MONITOR = new IOCategory("MON");

    toString() {
        return this.code;
    }

    static {
        registerAdapter(IOCategory, {
            serialize: function (data: string) {
                switch (data) {
                    case "OFF":
                        return IOCategory.OFF;
                    case "LCL":
                        return IOCategory.LOCAL;
                    case "AUX":
                        return IOCategory.AUX;
                    case "A":
                        return IOCategory.AES_A;
                    case "B":
                        return IOCategory.AES_B;
                    case "C":
                        return IOCategory.AES_C;
                    case "SC":
                        return IOCategory.STAGE_CONNECT;
                    case "USB":
                        return IOCategory.USB;
                    case "CRD":
                        return IOCategory.CARD;
                    case "MOD":
                        return IOCategory.MODULE;
                    case "AES":
                        return IOCategory.AES;
                    case "USR":
                        return IOCategory.USER;
                    case "OSC":
                        return IOCategory.OSCOLATOR;
                    case "BUS":
                        return IOCategory.BUS;
                    case "MAIN":
                        return IOCategory.MAIN;
                    case "MTX":
                        return IOCategory.MATRIX;
                    case "SEND":
                        return IOCategory.SEND;
                    case "MON":
                        return IOCategory.MONITOR;
                    default:
                        throw new Error("Unknown IO category: " + data);
                }
            },
            deserialize: function (data: IOCategory) {
                return data.code;
            }
        });
    }
}