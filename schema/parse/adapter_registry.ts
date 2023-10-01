let adapters = new Map<any, Adapter<any>>();

export interface Adapter<T> {
    serialize(data: string): T;
    deserialize(data: T): string;
}

export function registerAdapter<T>(type: any, adapter: Adapter<T>) {
    adapters.set(type, adapter);
}

export function parse<T>(type: any, data: string, currentObj: any): T {
    if (currentObj != undefined) {
        if (currentObj.parse != undefined) {
            return currentObj.parse(data);
        }
    }
    let adapter = adapters.get(type);
    if (adapter == undefined) {
        throw new Error("No adapter registered for type: " + type);
    }
    try {
        return adapter.serialize(data);
    } catch (e) {
        throw new Error("Error parsing data: " + data + " for type: " + type + ": " + e);
    }
}

// Register primitive types
registerAdapter(Boolean, {
    serialize: function (data: string) {
        return data == "1";
    },
    deserialize: function (data: boolean) {
        return data ? "1" : "0";
    }
});

registerAdapter(Number, {
    serialize: function (data: string) {
        return parseFloat(data);
    },
    deserialize: function (data: number) {
        return data.toString();
    }
});

registerAdapter(String, {
    serialize: function (data: string) {
        return data;
    },
    deserialize: function (data: string) {
        return data;
    }
});