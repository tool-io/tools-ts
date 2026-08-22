import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeightShiftCgInput = {
  readonly shiftedWeightLb: number;
  readonly shiftDistanceIn: number;
  readonly totalWeightLb: number;
};

export type WeightShiftCgOutput = {
  readonly cgShiftIn: number;
};

export const weightShiftCgExample = {
  input: { shiftDistanceIn: 20, shiftedWeightLb: 100, totalWeightLb: 2000 },
  output: { cgShiftIn: 1 },
} satisfies ToolExample<WeightShiftCgInput, WeightShiftCgOutput>;

export const calculateWeightShiftCg = (
  input: WeightShiftCgInput,
): WeightShiftCgOutput => {
  if (input.totalWeightLb <= 0)
    simpleError(
      "totalWeightLb",
      "The total weight must be positive.",
      "invalid_weight",
    );
  if (input.shiftedWeightLb <= 0)
    simpleError(
      "shiftedWeightLb",
      "The shifted weight must be positive.",
      "invalid_weight",
    );
  return {
    cgShiftIn:
      (input.shiftedWeightLb * input.shiftDistanceIn) / input.totalWeightLb,
  };
};

export const weightShiftCgTool = createSimpleTool({
  calculate: (input) =>
    calculateWeightShiftCg(input as unknown as WeightShiftCgInput),
  description:
    "Compute how far the center of gravity moves when a load is shifted a given distance.",
  id: "aviation/weight-shift-cg",
  inputs: [
    {
      description: "Weight being moved.",
      id: "shiftedWeightLb",
      kind: "number",
      label: "Shifted weight",
      unit: "lb",
    },
    {
      description: "Distance the load is moved; positive aft.",
      id: "shiftDistanceIn",
      kind: "number",
      label: "Shift distance",
      unit: "in",
    },
    {
      description: "Total aircraft weight after the move.",
      id: "totalWeightLb",
      kind: "number",
      label: "Total weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description:
        "Center-of-gravity movement; positive means the CG moved aft.",
      format: "length-in",
      id: "cgShiftIn",
      kind: "number",
      label: "CG shift",
      unit: "in",
    },
  ],
  title: "Weight Shift CG Calculator",
});
export const runWeightShiftCg = weightShiftCgTool.execute;
export default weightShiftCgTool;
