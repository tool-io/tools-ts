import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificLeafWeightInput = {
  readonly leafDryMassG: number;
  readonly leafAreaM2: number;
};

export type SpecificLeafWeightOutput = {
  readonly specificLeafWeight: number;
};

export const specificLeafWeightExample = {
  input: { leafDryMassG: 50, leafAreaM2: 0.5 },
  output: { specificLeafWeight: 100 },
} satisfies ToolExample<SpecificLeafWeightInput, SpecificLeafWeightOutput>;

export const specificLeafWeightTool = createSimpleTool({
  id: "biology/specific-leaf-weight",
  title: "Specific Leaf Weight",
  description:
    "Compute specific leaf weight in grams per square metre as leaf dry mass divided by one-sided leaf area.",
  inputs: [
    {
      id: "leafDryMassG",
      kind: "number",
      label: "Leaf dry mass",
      unit: "g",
    },
    {
      id: "leafAreaM2",
      kind: "number",
      label: "Leaf area",
      unit: "m²",
    },
  ],
  outputs: [
    {
      id: "specificLeafWeight",
      kind: "number",
      label: "Specific leaf weight",
      unit: "g/m²",
    },
  ],
  calculate: (input) => {
    const leafDryMassG = input.leafDryMassG as number;
    const leafAreaM2 = input.leafAreaM2 as number;
    if (!(leafDryMassG > 0))
      simpleError(
        "leafDryMassG",
        "The leaf dry mass must be greater than zero.",
      );
    if (!(leafAreaM2 > 0))
      simpleError("leafAreaM2", "The leaf area must be greater than zero.");
    return { specificLeafWeight: leafDryMassG / leafAreaM2 };
  },
});
export const runSpecificLeafWeight = specificLeafWeightTool.execute;
export default specificLeafWeightTool;
