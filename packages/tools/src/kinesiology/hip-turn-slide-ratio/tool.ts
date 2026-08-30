import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description:
    "Calculate hip turn-to-slide ratio from the supplied measurements.",
  example: { first: 45, second: 5 },
  first: { id: "hipTurnDegrees", label: "Hip turn" },
  formula: "ratio",
  id: "kinesiology/hip-turn-slide-ratio",
  output: {
    id: "turnDegreesPerCentimeter",
    label: "Turn per slide",
    unit: "°/cm",
  },
  second: { id: "lateralSlideCentimeters", label: "Lateral slide" },
  title: "Hip Turn-to-Slide Ratio",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
