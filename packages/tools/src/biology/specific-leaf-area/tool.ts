import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificLeafAreaInput = {
  readonly leafAreaCm2: number;
  readonly leafDryMassG: number;
};

export type SpecificLeafAreaOutput = {
  readonly specificLeafArea: number;
};

export const specificLeafAreaExample = {
  input: { leafAreaCm2: 250, leafDryMassG: 5 },
  output: { specificLeafArea: 50 },
} satisfies ToolExample<SpecificLeafAreaInput, SpecificLeafAreaOutput>;

export const specificLeafAreaTool = createSimpleTool({
  id: "biology/specific-leaf-area",
  title: "Specific Leaf Area",
  description:
    "Compute specific leaf area SLA in square centimetres per gram as one-sided leaf area divided by leaf dry mass.",
  inputs: [
    {
      id: "leafAreaCm2",
      kind: "number",
      label: "Leaf area",
      unit: "cm²",
    },
    {
      id: "leafDryMassG",
      kind: "number",
      label: "Leaf dry mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "specificLeafArea",
      kind: "number",
      label: "Specific leaf area",
      unit: "cm²/g",
    },
  ],
  calculate: (input) => {
    const leafAreaCm2 = input.leafAreaCm2 as number;
    const leafDryMassG = input.leafDryMassG as number;
    if (!(leafAreaCm2 > 0))
      simpleError("leafAreaCm2", "The leaf area must be greater than zero.");
    if (!(leafDryMassG > 0))
      simpleError(
        "leafDryMassG",
        "The leaf dry mass must be greater than zero.",
      );
    return { specificLeafArea: leafAreaCm2 / leafDryMassG };
  },
});
export const runSpecificLeafArea = specificLeafAreaTool.execute;
export default specificLeafAreaTool;
