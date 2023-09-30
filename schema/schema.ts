import type { WingObject, ObjectFactory } from './base.js';
import { Input, InputFactory } from './input.js';
import { Output, OutputFactory } from './output.js';
import { IOCategory } from './io.js';
import { Channel, ChannelFactory } from './channel.js';

export class WingSchema implements WingObject {
    io: IO;
    channels: Map<number, Channel>;
    
    constructor(io: IO) {
        this.io = io;
        this.channels = new Map();
    }

    toString() {
        return this.io.toString();
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
            schema.channels.set(i, channel);
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