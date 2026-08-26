import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafMassPerAreaInput = {
  readonly leafAreaCm2: number;
  readonly leafDryMassG: number;
};

export type LeafMassPerAreaOutput = {
  readonly leafMassPerArea: number;
};

export const leafMassPerAreaExample = {
  input: { leafAreaCm2: 500, leafDryMassG: 5 },
  output: { leafMassPerArea: 100 },
} satisfies ToolExample<LeafMassPerAreaInput, LeafMassPerAreaOutput>;

export const leafMassPerAreaTool = createSimpleTool({
  id: "biology/leaf-mass-per-area",
  title: "LMA",
  description:
    "Compute leaf mass per area LMA in grams per square metre as leaf dry mass divided by leaf area converted from square centimetres.",
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
      id: "leafMassPerArea",
      kind: "number",
      label: "Leaf mass per area",
      unit: "g/m²",
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
    return { leafMassPerArea: leafDryMassG / (leafAreaCm2 / 10000) };
  },
});
export const runLeafMassPerArea = leafMassPerAreaTool.execute;
export default leafMassPerAreaTool;
