import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description: "Calculate limb symmetry index from the supplied measurements.",
  example: { first: 90, second: 100 },
  first: { id: "involvedLimbResult", label: "Involved-limb result" },
  formula: "percent-ratio",
  id: "kinesiology/limb-symmetry-index",
  output: { id: "limbSymmetryPercent", label: "Limb symmetry", unit: "%" },
  second: { id: "uninvolvedLimbResult", label: "Uninvolved-limb result" },
  title: "Limb Symmetry Index",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
