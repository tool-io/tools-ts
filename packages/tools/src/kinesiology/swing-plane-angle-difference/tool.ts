import { createBinaryMetric } from "../../core/operational.js";

const operation = createBinaryMetric({
  description:
    "Calculate swing plane angle difference from the supplied measurements.",
  example: { first: 55, second: 48 },
  first: { id: "shaftAngleDegrees", label: "Shaft angle" },
  formula: "difference",
  id: "kinesiology/swing-plane-angle-difference",
  output: {
    id: "angleDifferenceDegrees",
    label: "Angle difference",
    unit: "°",
  },
  second: { id: "topAngleDegrees", label: "Top angle" },
  title: "Swing Plane Angle Difference",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
