import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const geneLengthExample = {
  input: { endPositionBp: 2234, startPositionBp: 1001 },
  output: { geneLengthBp: 1234 },
} satisfies ToolExample<
  {
    readonly endPositionBp: number;
    readonly startPositionBp: number;
  },
  { readonly geneLengthBp: number }
>;

export const geneLengthTool = createSimpleTool({
  id: "biology/gene-length",
  title: "Gene Coordinate Length",
  description:
    "Calculate gene length from one-based inclusive start and end coordinates: end − start + 1. Inclusive coordinates count both endpoint bases, so a feature whose start and end are equal is one base pair long.",
  inputs: [
    {
      id: "startPositionBp",
      label: "Start position",
      kind: "integer",
      minimum: 1,
      unit: "bp",
    },
    {
      id: "endPositionBp",
      label: "End position",
      kind: "integer",
      minimum: 1,
      unit: "bp",
    },
  ],
  outputs: [
    { id: "geneLengthBp", label: "Gene length", kind: "integer", unit: "bp" },
  ],
  calculate: (input) => {
    const startPositionBp = input.startPositionBp as number;
    const endPositionBp = input.endPositionBp as number;
    if (endPositionBp < startPositionBp)
      simpleError(
        "endPositionBp",
        "End position must not precede start position.",
        "invalid_coordinates",
      );
    return { geneLengthBp: endPositionBp - startPositionBp + 1 };
  },
});
export const runGeneLength = geneLengthTool.execute;
export default geneLengthTool;
