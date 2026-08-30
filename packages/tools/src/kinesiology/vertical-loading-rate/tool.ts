import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description:
    "Calculate vertical loading rate from the supplied measurements.",
  example: { first: 2.4, second: 0.08 },
  first: { id: "forceChangeBodyweights", label: "Force change" },
  formula: "ratio",
  id: "kinesiology/vertical-loading-rate",
  output: {
    id: "loadingRateBodyweightsPerSecond",
    label: "Vertical loading rate",
    unit: "BW/s",
  },
  second: { id: "loadingTimeSeconds", label: "Loading time" },
  title: "Vertical Loading Rate",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
