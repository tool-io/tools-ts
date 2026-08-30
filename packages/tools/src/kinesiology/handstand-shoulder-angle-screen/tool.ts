import { createRangeScreen } from "../../core/operational.js";

const operation = createRangeScreen({
  description:
    "Compare the measured value with caller-supplied bounds for handstand shoulder angle screen.",
  example: { value: 178, minimum: 175, maximum: 185 },
  id: "kinesiology/handstand-shoulder-angle-screen",
  maximum: { id: "maximumAngleDegrees", label: "Maximum angle", unit: "°" },
  minimum: { id: "minimumAngleDegrees", label: "Minimum angle", unit: "°" },
  title: "Handstand Shoulder Angle Screen",
  value: { id: "shoulderAngleDegrees", label: "Shoulder angle", unit: "°" },
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
