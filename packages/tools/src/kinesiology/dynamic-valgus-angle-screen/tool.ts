import { createRangeScreen } from "../../core/operational.js";

const operation = createRangeScreen({
  description:
    "Compare the measured value with caller-supplied bounds for dynamic valgus angle screen.",
  example: { value: 8, minimum: 0, maximum: 10 },
  id: "kinesiology/dynamic-valgus-angle-screen",
  maximum: {
    id: "maximumAngleDegrees",
    label: "Maximum accepted angle",
    unit: "°",
  },
  minimum: {
    id: "minimumAngleDegrees",
    label: "Minimum accepted angle",
    unit: "°",
  },
  title: "Dynamic Valgus Angle Screen",
  value: { id: "valgusAngleDegrees", label: "Dynamic valgus angle", unit: "°" },
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
