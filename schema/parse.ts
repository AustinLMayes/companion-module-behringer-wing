import { WingSchemaFactory } from "./schema.js";
const JSON_PATH = "/Users/austinmayes/Desktop/Snapshot.snap";

export const parseSnapshot = () => {
    var json = JSON.parse(JSON_PATH);
    return new WingSchemaFactory().createObject(json);
};