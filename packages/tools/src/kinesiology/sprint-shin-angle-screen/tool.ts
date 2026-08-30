import { createRangeScreen } from "../../core/operational.js";

const operation = createRangeScreen({
  description:
    "Compare the measured value with caller-supplied bounds for sprint shin angle screen.",
  example: { value: 46, minimum: 40, maximum: 55 },
  id: "kinesiology/sprint-shin-angle-screen",
  maximum: { id: "maximumAngleDegrees", label: "Maximum angle", unit: "°" },
  minimum: { id: "minimumAngleDegrees", label: "Minimum angle", unit: "°" },
  title: "Sprint Shin Angle Screen",
  value: { id: "shinAngleDegrees", label: "Shin angle", unit: "°" },
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
