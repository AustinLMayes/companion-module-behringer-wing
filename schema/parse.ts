import { WingSchemaFactory } from "./schema.js";
import fs from "fs";
const JSON_PATH = "/Users/austinmayes/Desktop/Snapshot.snap";

export const parseSnapshot = () => {
    // Read JSON file
    var json = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
    return new WingSchemaFactory().createObject(json["ae_data"], null);
};