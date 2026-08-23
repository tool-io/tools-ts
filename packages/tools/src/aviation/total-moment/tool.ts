import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalMomentInput = {
  readonly armCm: number;
  readonly weightKg: number;
};

export type TotalMomentOutput = {
  readonly momentKgCm: number;
};

export const totalMomentExample = {
  input: { armCm: 120, weightKg: 75 },
  output: { momentKgCm: 9000 },
} satisfies ToolExample<TotalMomentInput, TotalMomentOutput>;

export const calculateTotalMoment = (
  input: TotalMomentInput,
): TotalMomentOutput => {
  if (!(input.weightKg > 0))
    simpleError(
      "weightKg",
      "Weight must be greater than zero.",
      "positive_weight_required",
    );
  return { momentKgCm: input.weightKg * input.armCm };
};

export const totalMomentTool = createSimpleTool({
  id: "aviation/total-moment",
  title: "Total Moment Calculator",
  description: "Compute the moment of a weight applied at a given arm.",
  inputs: [
    { id: "armCm", label: "Arm", kind: "number", unit: "cm" },
    { id: "weightKg", label: "Weight", kind: "number", unit: "kg" },
  ],
  outputs: [
    { id: "momentKgCm", label: "Moment", kind: "number", unit: "kg·cm" },
  ],
  calculate: (input) =>
    calculateTotalMoment({
      armCm: input.armCm as number,
      weightKg: input.weightKg as number,
    }),
});
export const runTotalMoment = totalMomentTool.execute;
export default totalMomentTool;
