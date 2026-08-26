import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeafThicknessInput = {
  readonly slicesCountInt: number;
  readonly thicknessMeasurementsSumUm: number;
};

export type LeafThicknessOutput = {
  readonly leafThicknessUm: number;
};

export const leafThicknessExample = {
  input: { slicesCountInt: 5, thicknessMeasurementsSumUm: 450 },
  output: { leafThicknessUm: 90 },
} satisfies ToolExample<LeafThicknessInput, LeafThicknessOutput>;

export const leafThicknessTool = createSimpleTool({
  id: "biology/leaf-thickness",
  title: "Leaf Thickness Mean",
  description:
    "Compute mean leaf thickness in micrometres as the sum of cross-section thickness measurements divided by the number of slices measured.",
  inputs: [
    {
      id: "thicknessMeasurementsSumUm",
      kind: "number",
      label: "Sum of thickness measurements",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "slicesCountInt",
      kind: "integer",
      label: "Slices counted",
      minimum: 1,
      unit: "slices",
    },
  ],
  outputs: [
    {
      id: "leafThicknessUm",
      kind: "number",
      label: "Mean leaf thickness",
      unit: "µm",
    },
  ],
  calculate: (input) => {
    const thicknessMeasurementsSumUm =
      input.thicknessMeasurementsSumUm as number;
    const slicesCountInt = input.slicesCountInt as number;
    return {
      leafThicknessUm: thicknessMeasurementsSumUm / slicesCountInt,
    };
  },
});
export const runLeafThickness = leafThicknessTool.execute;
export default leafThicknessTool;
