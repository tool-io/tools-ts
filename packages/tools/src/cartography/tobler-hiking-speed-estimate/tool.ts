import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ToblerHikingSpeedEstimateInput = Readonly<{
  readonly riseMeters: number;
  readonly runMeters: number;
}>;
export type ToblerHikingSpeedEstimateOutput = Readonly<{
  readonly speedKilometersPerHour: number;
}>;

export const calculateToblerHikingSpeedEstimate = (
  x: ToblerHikingSpeedEstimateInput,
): ToblerHikingSpeedEstimateOutput => {
  if (!Number.isFinite(x.riseMeters))
    simpleError("riseMeters", "Provide a finite number.");
  if (!Number.isFinite(x.runMeters) || x.runMeters <= 0)
    simpleError("runMeters", "Provide a finite positive number.");
  const speedKilometersPerHour =
    6 * Math.exp(-3.5 * Math.abs(x.riseMeters / x.runMeters + 0.05));
  if (!Number.isFinite(speedKilometersPerHour))
    simpleError(
      "speedKilometersPerHour",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    speedKilometersPerHour: Object.is(speedKilometersPerHour, -0)
      ? 0
      : speedKilometersPerHour,
  };
};

export const example = {
  input: {
    riseMeters: -50,
    runMeters: 1000,
  },
  output: { speedKilometersPerHour: 6 },
} satisfies ToolExample<
  ToblerHikingSpeedEstimateInput,
  ToblerHikingSpeedEstimateOutput
>;

export const tool = createSimpleTool({
  id: "cartography/tobler-hiking-speed-estimate",
  title: "Tobler Hiking Speed Estimate",
  description:
    "Tobler hiking speed in km/h from signed rise/run slope: 6 exp(-3.5 |slope+0.05|).",
  inputs: [
    { id: "riseMeters", kind: "number", label: "Rise Meters", unit: "m" },
    {
      id: "runMeters",
      kind: "number",
      label: "Run Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "speedKilometersPerHour",
      kind: "number",
      label: "Speed Kilometers Per Hour",
      unit: "km/h",
    },
  ],
  calculate: (input) =>
    calculateToblerHikingSpeedEstimate({
      riseMeters: input.riseMeters as number,
      runMeters: input.runMeters as number,
    }),
});
export const toblerHikingSpeedEstimateTool = tool;
export const runToblerHikingSpeedEstimate = tool.execute;
export default tool;
