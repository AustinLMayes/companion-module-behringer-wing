import type { WingObject, ObjectFactory } from './base.js';
import { Input, InputFactory } from './input.js';

export class WingSchema implements WingObject {
    io: IO;
    
    constructor(io: IO) {
        this.io = io;
    }

    toString() {
        return this.io.toString();
    }
}

export class WingSchemaFactory implements ObjectFactory<WingSchema> {
    createObject(data: any): WingSchema {
        var schema = new WingSchema(new IOFactory().createObject(data["io"]));
        return schema;
    }
}

class IO implements WingObject {
    altSwitch: boolean;
    inputs: Map<InputCateory, Input[]>;

    constructor(altSwitch: boolean) {
        this.altSwitch = altSwitch;
        this.inputs = new Map();
    }

    toString() {
        var str = "IO:\n";
        InputCateory.ALL.forEach(category => {
            str += category.jsonName + ":\n";
            const inputs = this.inputs.get(category);
            if (inputs) {
                inputs.forEach(input => {
                    str += "\t" + input.name + "\n";
                });
                str += "( " + inputs.length + " inputs )\n";
            } else
                str += "\tNone\n";
        });
        return str;
    }
}

class InputCateory {
    jsonName: string;
    maxInputs: number;

    constructor(jsonName: string, maxInputs: number) {
        this.jsonName = jsonName;
        this.maxInputs = maxInputs;
    }

    static readonly LOCAL = new InputCateory("LCL", 8);
    static readonly AUXILIARY = new InputCateory("AUX", 8);
    static readonly AES_A = new InputCateory("A", 48);
    static readonly AES_B = new InputCateory("B", 48); 
    static readonly AES_C = new InputCateory("C", 48);
    static readonly STAGE_CONNECT = new InputCateory("SC", 32);
    static readonly USB = new InputCateory("USB", 48);
    static readonly CARD = new InputCateory("CRD", 64);
    static readonly MODULE = new InputCateory("MOD", 64);
    static readonly AES_EBU = new InputCateory("AES", 2);
    static readonly USER_SIGNAL = new InputCateory("USR", 24);
    static readonly OSCELATOR = new InputCateory("OSC", 2);
    static readonly BUS = new InputCateory("$BUS", 24);
    static readonly MAIN = new InputCateory("$MAIN", 8);
    static readonly MATRIX = new InputCateory("$MTX", 16);
    static readonly FX_SEND = new InputCateory("$SEND", 32);
    static readonly MONITOR = new InputCateory("$MON", 4);

    // All input categories
    static readonly ALL = [
        InputCateory.LOCAL,
        InputCateory.AUXILIARY,
        InputCateory.AES_A,
        InputCateory.AES_B,
        InputCateory.AES_C,
        InputCateory.STAGE_CONNECT,
        InputCateory.USB,
        InputCateory.CARD,
        InputCateory.MODULE,
        InputCateory.AES_EBU,
        InputCateory.USER_SIGNAL,
        InputCateory.OSCELATOR,
        InputCateory.BUS,
        InputCateory.MAIN,
        InputCateory.MATRIX,
        InputCateory.FX_SEND,
        InputCateory.MONITOR
    ];
}

class IOFactory implements ObjectFactory<IO> {
    createObject(data: any): IO {
        var altSwitch = data["altsw"] == 1;
        var io = new IO(altSwitch);
        this.readInputs(data['in'], io);
        return io;
    }

    readInputs(data: any, io: IO) {
        InputCateory.ALL.forEach(category => {
            var inputs: Input[] = [];
            for (var i = 1; i <= category.maxInputs; i++) {
                // If the input is null, we've reached the end of the list
                if (data[category.jsonName] == null) {
                    console.log("Reached end of input list for category " + category.jsonName);
                    break;
                }
                var raw = data[category.jsonName][i];
                if (raw == null) {
                    console.log("Reached end of input list for category " + category.jsonName);
                    break;
                }
                var input = new InputFactory().createObject(raw);
                console.log("Created input " + input.name + " in category " + category.jsonName);
                inputs.push(input);
            }
            io.inputs.set(category, inputs);
        });
    }
}