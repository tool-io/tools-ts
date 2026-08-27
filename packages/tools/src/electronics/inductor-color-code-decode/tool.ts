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

export const inductorColorCodeExample = {
  input: { band1: "brown", band2: "black", band3: "brown" },
  output: { inductanceUh: 100 },
} satisfies ToolExample<
  { readonly band1: string; readonly band2: string; readonly band3: string },
  { readonly inductanceUh: number }
>;

const bandField = (id: string, label: string) => ({
  enum: COLORS,
  id,
  kind: "string" as const,
  label,
});

export const inductorColorCodeTool = createSimpleTool({
  id: "electronics/inductor-color-code-decode",
  title: "Inductor Color Code",
  description:
    "Decode a three-band inductor color code into inductance in microhenries.",
  inputs: [
    bandField("band1", "First band"),
    bandField("band2", "Second band"),
    bandField("band3", "Third band"),
  ],
  outputs: [
    { id: "inductanceUh", kind: "number", label: "Inductance", unit: "µH" },
  ],
  calculate: (input) => {
    const d1 = COLORS.indexOf(input.band1 as string);
    const d2 = COLORS.indexOf(input.band2 as string);
    const d3 = COLORS.indexOf(input.band3 as string);
    return { inductanceUh: (d1 * 10 + d2) * Math.pow(10, d3) };
  },
});
export const runInductorColorCodeDecode = inductorColorCodeTool.execute;
export default inductorColorCodeTool;
