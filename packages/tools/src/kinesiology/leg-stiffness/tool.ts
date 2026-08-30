import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description: "Calculate leg stiffness from the supplied measurements.",
  example: { first: 2400, second: 0.12 },
  first: { id: "peakVerticalForceNewtons", label: "Peak vertical force" },
  formula: "ratio",
  id: "kinesiology/leg-stiffness",
  output: {
    id: "legStiffnessNewtonsPerMeter",
    label: "Leg stiffness",
    unit: "N/m",
  },
  second: { id: "verticalDisplacementMeters", label: "Vertical displacement" },
  title: "Leg Stiffness",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
