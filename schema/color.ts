import { registerAdapter } from "./parse/adapter_registry.js";

export class WingColor {
    index: number;
    name: string;

    constructor(index: number, name: string) {
        this.index = index;
        this.name = name;
    }

    toString() {
        return this.name;
    }

    static GRAY_BLUE = new WingColor(0, "gray blue");
    static MEDIUM_BLUE = new WingColor(1, "medium blue");
    static DARK_BLUE = new WingColor(2, "dark blue");
    static TURQUOISE = new WingColor(3, "turquoise");
    static GREEN = new WingColor(4, "green");
    static OLIVE_GREEN = new WingColor(5, "olive green");
    static YELLOW = new WingColor(6, "yellow");
    static ORANGE = new WingColor(7, "orange");
    static RED = new WingColor(8, "red");
    static CORAL = new WingColor(9, "coral");
    static PINK = new WingColor(10, "pink");
    static MAUVE = new WingColor(11, "mauve");

    static values = [
        WingColor.GRAY_BLUE,
        WingColor.MEDIUM_BLUE,
        WingColor.DARK_BLUE,
        WingColor.TURQUOISE,
        WingColor.GREEN,
        WingColor.OLIVE_GREEN,
        WingColor.YELLOW,
        WingColor.ORANGE,
        WingColor.RED,
        WingColor.CORAL,
        WingColor.PINK,
        WingColor.MAUVE
    ];

    static fromIndex(index: number): WingColor {
        return WingColor.values[index];
    }
}

registerAdapter(WingColor, {
    serialize: (data: string) => {
        return WingColor.fromIndex(parseInt(data) - 1);
    },
    deserialize: (data: WingColor) => {
        return (data.index + 1).toString();
    }
});

export function colorSelectType(): object {
    return {
        type: "select",
        options: WingColor.values.map((color) => {
            return {
                value: color.index.toString(),
                label: color.name
            };
        }),
        default: "0"
    };
}