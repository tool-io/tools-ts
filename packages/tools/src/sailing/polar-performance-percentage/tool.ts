import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolarPerformancePercentageInput = {
  readonly achievedSpeedKt: number;
  readonly targetSpeedKt: number;
};

export type PolarPerformancePercentageOutput = {
  readonly performancePercentage: number;
};

export const calculatePolarPerformancePercentage = (
  achievedSpeedKt: number,
  targetSpeedKt: number,
): number | null =>
  Number.isFinite(achievedSpeedKt) &&
  Number.isFinite(targetSpeedKt) &&
  targetSpeedKt > 0 &&
  achievedSpeedKt >= 0
    ? (achievedSpeedKt / targetSpeedKt) * 100
    : null;

export const polarPerformancePercentageExample = {
  input: { achievedSpeedKt: 6, targetSpeedKt: 8 },
  output: { performancePercentage: 75 },
} satisfies ToolExample<
  PolarPerformancePercentageInput,
  PolarPerformancePercentageOutput
>;

export const polarPerformancePercentageTool = createSimpleTool({
  id: "sailing/polar-performance-percentage",
  title: "Polar Performance Percentage Calculator",
  description:
    "Compare the achieved boat speed against the polar target speed as a percentage of target performance.",
  inputs: [
    {
      id: "achievedSpeedKt",
      kind: "number",
      label: "Achieved speed",
      unit: "kt",
    },
    { id: "targetSpeedKt", kind: "number", label: "Target speed", unit: "kt" },
  ],
  outputs: [
    {
      format: "percentage",
      id: "performancePercentage",
      kind: "number",
      label: "Polar performance",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const achieved = input.achievedSpeedKt as number;
    const target = input.targetSpeedKt as number;
    const performancePercentage = calculatePolarPerformancePercentage(
      achieved,
      target,
    );
    if (performancePercentage === null)
      simpleError(
        target <= 0 ? "targetSpeedKt" : "achievedSpeedKt",
        "Enter a positive target speed and a non-negative achieved speed.",
        "invalid_speed",
      );
    return { performancePercentage };
  },
});

export const runPolarPerformancePercentage =
  polarPerformancePercentageTool.execute;
export default polarPerformancePercentageTool;
