import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description:
    "Calculate rowing drive-to-recovery ratio from the supplied measurements.",
  example: { first: 0.8, second: 1.6 },
  first: { id: "driveTimeSeconds", label: "Drive time" },
  formula: "ratio",
  id: "kinesiology/rowing-drive-recovery-ratio",
  output: {
    id: "driveRecoveryRatio",
    label: "Drive-to-recovery ratio",
    unit: "ratio",
  },
  second: { id: "recoveryTimeSeconds", label: "Recovery time" },
  title: "Rowing Drive-to-Recovery Ratio",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
