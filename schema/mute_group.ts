import { Named, ObjectPropertyParser, type ObjectFactory } from "./base.js";
import type { WingSchema } from "./schema.js";

export class MuteGroup {
    name: string;
    muted: boolean;

    constructor(name: string, muted: boolean) {
        this.name = name;
        this.muted = muted;
    }

    toString() {
        return this.name + " (muted: " + this.muted + ")";
    }
    
}

export class MuteGroupFactory implements ObjectFactory<MuteGroup> {
    createObject(data: any, schema: WingSchema | null): MuteGroup {
        var name = Named.NAME_PARSER.parse(data);
        var muted = MuteGroupFactory.MUTED_PARSER.parse(data);
        return new MuteGroup(name, muted);
    }

    static readonly INSTANCE = new MuteGroupFactory();

    static readonly MUTED_PARSER = ObjectPropertyParser.boolean("mute");
}