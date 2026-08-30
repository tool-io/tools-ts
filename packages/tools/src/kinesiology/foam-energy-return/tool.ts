import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description: "Calculate foam energy return from the supplied measurements.",
  example: { first: 65, second: 100 },
  first: { id: "returnedEnergyJoules", label: "Returned energy" },
  formula: "percent-ratio",
  id: "kinesiology/foam-energy-return",
  output: { id: "energyReturnPercent", label: "Energy return", unit: "%" },
  second: { id: "inputEnergyJoules", label: "Input energy" },
  title: "Foam Energy Return",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
