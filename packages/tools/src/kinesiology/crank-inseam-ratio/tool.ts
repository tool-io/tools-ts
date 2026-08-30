import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description:
    "Calculate crank-to-inseam ratio from the supplied measurements.",
  example: { first: 170, second: 800 },
  first: { id: "crankLengthMillimeters", label: "Crank length" },
  formula: "percent-ratio",
  id: "kinesiology/crank-inseam-ratio",
  output: {
    id: "crankToInseamPercent",
    label: "Crank-to-inseam ratio",
    unit: "%",
  },
  second: { id: "inseamMillimeters", label: "Inseam" },
  title: "Crank-to-Inseam Ratio",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
