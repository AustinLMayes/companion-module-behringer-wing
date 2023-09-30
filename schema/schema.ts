import type { WingObject, ObjectFactory } from './base.js';
import { Input, InputFactory } from './input.js';
import { Output, OutputFactory } from './output.js';
import { IOCategory } from './io.js';
import { Channel, ChannelFactory } from './strip/channel.js';
import { Aux, AuxFactory } from './strip/aux.js';
import { BusFactory, type Bus } from './strip/bus.js';
import type { Main } from './strip/main.js';
import { MainFactory } from './strip/main.js';
import { Matrix, MatrixFactory } from './strip/matrix.js';
import type { ChannelBase } from './strip/channel_base.js';

export class WingSchema implements WingObject {
    io: IO;
    channels: Channel[]; // 40
    auxes: Aux[]; // 8
    busses: Bus[]; // 16
    mains: Main[]; // 4
    matrices: Matrix[]; // 8
    
    constructor(io: IO) {
        this.io = io;
        this.channels = [];
        this.auxes = [];
        this.busses = [];
        this.mains = [];
        this.matrices = [];
    }

    toString() {
        return this.io.toString();
    }

    // Name is CH.# or AUX.#
    getChannel(chanName: string): ChannelBase | null {
        if (chanName == "OFF") 
            return null;
        if (this.channels.length == 0) {
            throw new Error("Schema has no channels");
        }
        if (this.auxes.length == 0) {
            throw new Error("Schema has no auxes");
        }
        if (chanName.startsWith("CH.")) {
            var chanNumber = parseInt(chanName.substring(3));
            if (chanNumber > 40) {
                throw new Error("Channel number " + chanNumber + " is out of range");
            }
            return this.channels[chanNumber] || null;
        }
        if (chanName.startsWith("AUX.")) {
            var auxNumber = parseInt(chanName.substring(4));
            if (auxNumber > 8) {
                throw new Error("Aux number " + auxNumber + " is out of range");
            }
            return this.auxes[auxNumber] || null;
        }
        throw new Error("Invalid channel name: " + chanName);
    }

}

export class WingSchemaFactory implements ObjectFactory<WingSchema> {
    createObject(data: any, s: WingSchema | null): WingSchema {
        var schema = new WingSchema(IOFactory.INSTANCE.createObject(data["io"], null));
        for (var i = 1; i <= 40; i++) {
            var dat = data["ch"][i];
            if (dat == null) {
                console.log("Reached end of channel list");
                break;
            }
            var channel = ChannelFactory.INSTANCE.createObject(dat, schema);
            schema.channels[i] = channel;
        }
        for (var i = 1; i <= 8; i++) {
            var dat = data["aux"][i];
            if (dat == null) {
                console.log("Reached end of aux list");
                break;
            }
            var aux = AuxFactory.INSTANCE.createObject(dat, schema);
            schema.auxes[i] = aux;
        }
        for (var i = 1; i <= 16; i++) {
            var dat = data["bus"][i];
            if (dat == null) {
                console.log("Reached end of bus list");
                break;
            }
            var bus = BusFactory.INSTANCE.createObject(dat, schema);
            schema.busses[i] = bus;
        }
        for (var i = 1; i <= 4; i++) {
            var dat = data["main"][i];
            if (dat == null) {
                console.log("Reached end of main list");
                break;
            }
            var main = MainFactory.INSTANCE.createObject(dat, schema);
            schema.mains[i] = main;
        }
        for (var i = 1; i <= 8; i++) {
            var dat = data["mtx"][i];
            if (dat == null) {
                console.log("Reached end of matrix list");
                break;
            }
            var matrix = MatrixFactory.INSTANCE.createObject(dat, schema);
            schema.matrices[i] = matrix;
        }
        return schema;
    }
}

class IO implements WingObject {
    altSwitch: boolean;
    inputs: Map<IOCategory, Input[]>;
    outputs: Map<IOCategory, Output[]>;

    constructor(altSwitch: boolean) {
        this.altSwitch = altSwitch;
        this.inputs = new Map();
        this.outputs = new Map();
    }

    toString() {
        var str = "IO:\n";
        IOCategory.ALL.forEach(category => {
            str += category.jsonName + ":\n";
            if (this.inputs.has(category)) {
                var inputs: Input[] = this.inputs.get(category) as Input[];
                var i = 1;
                inputs.forEach(input => {
                    var input: Input = input as Input;
                    str += "    " + i + " - " + input.toString() + "\n";
                    i++;
                });
            }
            if (this.outputs.has(category)) {
                var outputs: Output[] = this.outputs.get(category) as Output[];
                var i = 1;
                outputs.forEach(output => {
                    var output: Output = output as Output;
                    str += "    " + i + " - " + output.toString() + "\n";
                    i++;
                });
            }
        });
        return str;
    }

    findInput(category: IOCategory, inputNumber: number): Input | null {
        var inputs = this.inputs.get(category);
        if (inputs == undefined) {
            return null;
        }
        return inputs.find(input => input.inputNumber == inputNumber) || null;
    }
}

class IOFactory implements ObjectFactory<IO> {
    createObject(data: any, schema: WingSchema | null): IO {
        var altSwitch = data["altsw"] == 1;
        var io = new IO(altSwitch);
        this.readInputs(data['in'], io, schema);
        this.readOutputs(data['out'], io, schema);
        return io;
    }

    readInputs(data: any, io: IO, schema: WingSchema | null) {
        IOCategory.ALL.forEach(category => {
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
                raw["_id"] = i;
                var input = InputFactory.INSTANCE.createObject(raw, schema);
                inputs.push(input);
            }
            io.inputs.set(category, inputs);
        });
    }

    readOutputs(data: any, io: IO, schema: WingSchema | null) {
        IOCategory.ALL.forEach(category => {
            var outputs: Output[] = [];
            for (var i = 1; i <= category.maxInputs; i++) {
                // If the output is null, we've reached the end of the list
                if (data[category.jsonName] == null) {
                    console.log("Reached end of output list for category " + category.jsonName);
                    break;
                }
                var raw = data[category.jsonName][i];
                if (raw == null) {
                    console.log("Reached end of output list for category " + category.jsonName);
                    break;
                }
                raw["_id"] = i;
                var output = OutputFactory.INSTANCE.createObject(raw, schema);
                outputs.push(output);
            }
            io.outputs.set(category, outputs);
        });
    }

    static INSTANCE = new IOFactory();
}