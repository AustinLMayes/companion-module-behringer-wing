import { Input } from './input.js';
import { Output } from './output.js';
import { IOCategory } from './io.js';
import { Channel } from './strip/channel.js';
import { Aux } from './strip/aux.js';
import { Bus } from './strip/bus.js';
import { Main } from './strip/main.js';
import { Matrix } from './strip/matrix.js';
import type { ChannelBase } from './strip/channel_base.js';
import { DCA } from './strip/dca.js';
import { MuteGroup } from './mute_group.js';
import { WingObject, WingProperty } from './parse/decorators.js';

@WingObject
class InputData {
    @WingProperty("LCL", Input, 8)
    localIns: Input[];
    @WingProperty("AUX", Input, 8)
    auxIns: Input[];
    @WingProperty("A", Input, 48)
    aesAIns: Input[];
    @WingProperty("B", Input, 48)
    aesBIns: Input[];
    @WingProperty("C", Input, 48)
    aesCIns: Input[];
    @WingProperty("SC", Input, 32)
    stageConnectIns: Input[];
    @WingProperty("USB", Input, 48)
    usbIns: Input[];
    @WingProperty("CRD", Input, 64)
    cardIns: Input[];
    @WingProperty("MOD", Input, 64)
    moduleIns: Input[];
    @WingProperty("PLAY", Input, 4)
    playbackIns: Input[];
    @WingProperty("AES", Input, 2)
    aesEbuIns: Input[];
    @WingProperty("USR", Input, 24)
    userSignalIns: Input[];
    @WingProperty("OSC", Input, 2)
    oscelatorIns: Input[];

    toString() {
        var str = "InputData:\n";
        str += "\tlocal inputs:\n";
        str += "\t\t" + this.localIns+ "\n";
        str += "\taux inputs:\n";
        str += "\t\t" + this.auxIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tAES A inputs:\n";
        str += "\t\t" + this.aesAIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tAES B inputs:\n";
        str += "\t\t" + this.aesBIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tAES C inputs:\n";
        str += "\t\t" + this.aesCIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tstage connect inputs:\n";
        str += "\t\t" + this.stageConnectIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tUSB inputs:\n";
        str += "\t\t" + this.usbIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tcard inputs:\n";
        str += "\t\t" + this.cardIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tmodule inputs:\n";
        str += "\t\t" + this.moduleIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tplayback inputs:\n";
        str += "\t\t" + this.playbackIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tAES EBU inputs:\n";
        str += "\t\t" + this.aesEbuIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\tuser signal inputs:\n";
        str += "\t\t" + this.userSignalIns.map(input => input.toString()).join("\n\t\t") + "\n";
        str += "\toscelator inputs:\n";
        str += "\t\t" + this.oscelatorIns.map(input => input.toString()).join("\n\t\t") + "\n";
        return str;
    }
}

@WingObject
class OutputData {
    @WingProperty("LCL", Output, 8)
    localOuts: Output[];
    @WingProperty("AUX", Output, 8)
    auxOuts: Output[];
    @WingProperty("A", Output, 48)
    aesAOuts: Output[];
    @WingProperty("B", Output, 48)
    aesBOuts: Output[];
    @WingProperty("C", Output, 48)
    aesCOuts: Output[];
    @WingProperty("SC", Output, 32)
    stageConnectOuts: Output[];
    @WingProperty("USB", Output, 48)
    usbOuts: Output[];
    @WingProperty("CRD", Output, 64)
    cardOuts: Output[];
    @WingProperty("MOD", Output, 64)
    moduleOuts: Output[];
    @WingProperty("REC", Output, 4)
    recordingOuts: Output[];
    @WingProperty("AES", Output, 2)
    aesEbuOuts: Output[];
    @WingProperty("USR", Output, 24)
    userSignalOuts: Output[];
    @WingProperty("OSC", Output, 2)
    oscelatorOuts: Output[];

    toString() {
        var str = "OutputData:\n";
        str += "\tlocal outputs:\n";
        str += "\t\t" + this.localOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\taux outputs:\n";
        str += "\t\t" + this.auxOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tAES A outputs:\n";
        str += "\t\t" + this.aesAOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tAES B outputs:\n";
        str += "\t\t" + this.aesBOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tAES C outputs:\n";
        str += "\t\t" + this.aesCOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tstage connect outputs:\n";
        str += "\t\t" + this.stageConnectOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tUSB outputs:\n";
        str += "\t\t" + this.usbOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tcard outputs:\n";
        str += "\t\t" + this.cardOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tmodule outputs:\n";
        str += "\t\t" + this.moduleOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\trecording outputs:\n";
        str += "\t\t" + this.recordingOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tAES EBU outputs:\n";
        str += "\t\t" + this.aesEbuOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\tuser signal outputs:\n";
        str += "\t\t" + this.userSignalOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        str += "\toscelator outputs:\n";
        str += "\t\t" + this.oscelatorOuts.map(output => output.toString()).join("\n\t\t") + "\n";
        return str;
    }
}

@WingObject
class IO {
    @WingProperty("altsw", Boolean)
    altSwitch: boolean = false;
    @WingProperty("in", InputData)
    inputsData: InputData = new InputData();
    @WingProperty("out", OutputData)
    outputsData: OutputData = new OutputData();

    toString() {
        var str = "IO:\n";
        str += "\talt switch: " + this.altSwitch + "\n";
        str += "\tinputs:\n";
        str += "\t\t" + this.inputsData.toString().replace(/\n/g, "\n\t\t") + "\n";
        str += "\toutputs:\n";
        str += "\t\t" + this.outputsData.toString().replace(/\n/g, "\n\t\t") + "\n";
        return str;
    }

    findInput(category: IOCategory, inputNumber: number): Input | null {
        switch (category) {
            case IOCategory.LOCAL:
                return this.inputsData.localIns[inputNumber] || null;
            case IOCategory.AUX:
                return this.inputsData.auxIns[inputNumber] || null;
            case IOCategory.AES_A:
                return this.inputsData.aesAIns[inputNumber] || null;
            case IOCategory.AES_B:
                return this.inputsData.aesBIns[inputNumber] || null;
            case IOCategory.AES_C:
                return this.inputsData.aesCIns[inputNumber] || null;
            case IOCategory.STAGE_CONNECT:
                return this.inputsData.stageConnectIns[inputNumber] || null;
            case IOCategory.USB:
                return this.inputsData.usbIns[inputNumber] || null;
            case IOCategory.CARD:
                return this.inputsData.cardIns[inputNumber] || null;
            case IOCategory.MODULE:
                return this.inputsData.moduleIns[inputNumber] || null;
            case IOCategory.USER:
                return this.inputsData.userSignalIns[inputNumber] || null;
            case IOCategory.OSCOLATOR:
                return this.inputsData.oscelatorIns[inputNumber] || null;
            case IOCategory.AES:
                return this.inputsData.aesEbuIns[inputNumber] || null;
            default:
                throw new Error("Invalid input category: " + category);
        }
    }
}

@WingObject
export class WingSchema {
    @WingProperty("io", IO)
    io: IO = new IO();
    @WingProperty("ch", Channel, 40)
    channels: Channel[]; // 40
    @WingProperty("aux", Aux, 8)
    auxes: Aux[]; // 8
    @WingProperty("bus", Bus, 16)
    busses: Bus[]; // 16
    @WingProperty("main", Main, 4)
    mains: Main[]; // 4
    @WingProperty("mtx", Matrix, 8)
    matrices: Matrix[]; // 8
    @WingProperty("dca", DCA, 16)
    dcas: DCA[]; // 16
    @WingProperty("mgrp", MuteGroup, 8)
    muteGroups: MuteGroup[]; // 8

    toString() {
        var str = "WingSchema:\n";
        // str += "IO:\n";
        // str += this.io.toString().replace(/\n/g, "\n\t") + "\n";
        str += "Channels:\n";
        str += "\t" + this.channels.map(channel => channel.toString()).join("\n\t") + "\n";
        str += "Auxes:\n";
        str += "\t" + this.auxes.map(aux => aux.toString()).join("\n\t") + "\n";
        str += "Busses:\n";
        str += "\t" + this.busses.map(bus => bus.toString()).join("\n\t") + "\n";
        str += "Mains:\n";
        str += "\t" + this.mains.map(main => main.toString()).join("\n\t") + "\n";
        str += "Matrices:\n";
        str += "\t" + this.matrices.map(matrix => matrix.toString()).join("\n\t") + "\n";
        str += "DCAs:\n";
        str += "\t" + this.dcas.map(dca => dca.toString()).join("\n\t") + "\n";
        str += "Mute Groups:\n";
        str += "\t" + this.muteGroups.map(muteGroup => muteGroup.toString()).join("\n\t") + "\n";
        return str;
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