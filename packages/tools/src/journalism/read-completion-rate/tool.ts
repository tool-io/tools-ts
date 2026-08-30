import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description: "Calculate read completion rate from the supplied measurements.",
  example: { first: 1800, second: 2400 },
  first: { id: "consumedDepthPixels", label: "Consumed depth" },
  formula: "percent-ratio",
  id: "journalism/read-completion-rate",
  output: { id: "completionPercent", label: "Read completion", unit: "%" },
  second: { id: "articleDepthPixels", label: "Article depth" },
  title: "Read Completion Rate",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
