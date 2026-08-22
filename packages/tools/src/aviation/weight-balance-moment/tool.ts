import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeightBalanceMomentInput = {
  readonly armInches: number;
  readonly weightLb: number;
};

export type WeightBalanceMomentOutput = {
  readonly momentLbIn: number;
};

export const weightBalanceMomentExample = {
  input: { armInches: 40, weightLb: 200 },
  output: { momentLbIn: 8000 },
} satisfies ToolExample<WeightBalanceMomentInput, WeightBalanceMomentOutput>;

export const calculateWeightBalanceMoment = (
  input: WeightBalanceMomentInput,
): WeightBalanceMomentOutput => {
  if (input.weightLb <= 0)
    simpleError("weightLb", "The weight must be positive.", "invalid_weight");
  return {
    momentLbIn: input.weightLb * input.armInches,
  };
};

export const weightBalanceMomentTool = createSimpleTool({
  calculate: (input) =>
    calculateWeightBalanceMoment(input as unknown as WeightBalanceMomentInput),
  description: "Compute the load moment from a weight and its arm distance.",
  id: "aviation/weight-balance-moment",
  inputs: [
    {
      description: "Item weight.",
      id: "weightLb",
      kind: "number",
      label: "Weight",
      unit: "lb",
    },
    {
      description: "Arm distance of the item from the reference datum.",
      id: "armInches",
      kind: "number",
      label: "Arm",
      unit: "in",
    },
  ],
  outputs: [
    {
      description: "Moment about the datum.",
      format: "moment-lb-in",
      id: "momentLbIn",
      kind: "number",
      label: "Moment",
      unit: "lb·in",
    },
  ],
  title: "Weight Balance Moment Calculator",
});
export const runWeightBalanceMoment = weightBalanceMomentTool.execute;
export default weightBalanceMomentTool;
