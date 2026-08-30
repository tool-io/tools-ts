import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterDemandPeakInput = Readonly<{
  readonly averageCubicMetersPerDay: number;
  readonly peakFactor: number;
}>;
export type WaterDemandPeakOutput = Readonly<{
  readonly peakCubicMetersPerDay: number;
}>;

export const calculateWaterDemandPeak = (
  x: WaterDemandPeakInput,
): WaterDemandPeakOutput => {
  if (
    !Number.isFinite(x.averageCubicMetersPerDay) ||
    x.averageCubicMetersPerDay < 0
  )
    simpleError(
      "averageCubicMetersPerDay",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.peakFactor) || x.peakFactor < 0)
    simpleError("peakFactor", "Provide a finite number at least 0.");
  const peakCubicMetersPerDay = x.averageCubicMetersPerDay * x.peakFactor;
  if (!Number.isFinite(peakCubicMetersPerDay))
    simpleError(
      "peakCubicMetersPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    peakCubicMetersPerDay: Object.is(peakCubicMetersPerDay, -0)
      ? 0
      : peakCubicMetersPerDay,
  };
};

export const example = {
  input: { averageCubicMetersPerDay: 100, peakFactor: 1.5 },
  output: { peakCubicMetersPerDay: 150 },
} satisfies ToolExample<WaterDemandPeakInput, WaterDemandPeakOutput>;

export const tool = createSimpleTool({
  id: "engineering/water-demand-peak",
  title: "Water Demand Peak",
  description:
    "Peak daily water-demand estimate from average daily demand times a supplied peak factor.",
  inputs: [
    {
      id: "averageCubicMetersPerDay",
      kind: "number",
      label: "Average Cubic Meters Per Day",
      unit: "m³/day",
      minimum: 0,
    },
    { id: "peakFactor", kind: "number", label: "Peak Factor", minimum: 0 },
  ],
  outputs: [
    {
      id: "peakCubicMetersPerDay",
      kind: "number",
      label: "Peak Cubic Meters Per Day",
      unit: "m³/day",
    },
  ],
  calculate: (input) =>
    calculateWaterDemandPeak({
      averageCubicMetersPerDay: input.averageCubicMetersPerDay as number,
      peakFactor: input.peakFactor as number,
    }),
});
export const waterDemandPeakTool = tool;
export const runWaterDemandPeak = tool.execute;
export default tool;
