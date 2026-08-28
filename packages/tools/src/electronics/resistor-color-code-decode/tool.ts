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
] as const;

export const resistorColorCodeDecodeExample = {
  input: { band1: "brown", band2: "black", band3: "red" },
  output: { resistanceOhms: 1000 },
} satisfies ToolExample<
  { readonly band1: string; readonly band2: string; readonly band3: string },
  { readonly resistanceOhms: number }
>;

const bandField = (id: string, label: string) => ({
  enum: COLORS,
  id,
  kind: "string" as const,
  label,
});

export const resistorColorCodeDecodeTool = createSimpleTool({
  id: "electronics/resistor-color-code-decode",
  title: "Resistor Color Code Decode",
  description:
    "Decode a three-band resistor color code into resistance in ohms.",
  inputs: [
    bandField("band1", "First band"),
    bandField("band2", "Second band"),
    bandField("band3", "Third band"),
  ],
  outputs: [
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "Ω" },
  ],
  calculate: (input) => {
    const d1 = COLORS.indexOf(input.band1 as string);
    const d2 = COLORS.indexOf(input.band2 as string);
    const d3 = COLORS.indexOf(input.band3 as string);
    return { resistanceOhms: (d1 * 10 + d2) * Math.pow(10, d3) };
  },
});
export const runResistorColorCodeDecode = resistorColorCodeDecodeTool.execute;
export default resistorColorCodeDecodeTool;
