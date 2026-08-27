import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const COLORS: readonly string[] = [
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "grey",
  "white",
];

export const capacitorColorCodeExample = {
  input: { band1: "brown", band2: "black", band3: "orange" },
  output: { capacitanceNf: 10 },
} satisfies ToolExample<
  { readonly band1: string; readonly band2: string; readonly band3: string },
  { readonly capacitanceNf: number }
>;

const bandField = (id: string, label: string) => ({
  enum: COLORS,
  id,
  kind: "string" as const,
  label,
});

export const capacitorColorCodeTool = createSimpleTool({
  id: "electronics/capacitor-color-code-decode",
  title: "Capacitor Color Code",
  description:
    "Decode a three-band capacitor color code into capacitance in nanofarads.",
  inputs: [
    bandField("band1", "First band"),
    bandField("band2", "Second band"),
    bandField("band3", "Third band"),
  ],
  outputs: [
    { id: "capacitanceNf", kind: "number", label: "Capacitance", unit: "nF" },
  ],
  calculate: (input) => {
    const d1 = COLORS.indexOf(input.band1 as string);
    const d2 = COLORS.indexOf(input.band2 as string);
    const d3 = COLORS.indexOf(input.band3 as string);
    const picofarads = (d1 * 10 + d2) * Math.pow(10, d3);
    return { capacitanceNf: picofarads / 1000 };
  },
});
export const runCapacitorColorCodeDecode = capacitorColorCodeTool.execute;
export default capacitorColorCodeTool;
