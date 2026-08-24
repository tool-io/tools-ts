import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TakeoffDistanceRequiredWithSlopeInput = {
  readonly baseDistanceM: number;
  readonly distanceChangePercentPerSlopePercent?: number;
  readonly slopePercent: number;
};

export type TakeoffDistanceRequiredWithSlopeOutput = {
  readonly takeoffDistanceMeters: number;
};

export const takeoffDistanceRequiredWithSlopeExample = {
  input: { baseDistanceM: 1000, slopePercent: 2 },
  output: { takeoffDistanceMeters: 1200 },
} satisfies ToolExample<
  TakeoffDistanceRequiredWithSlopeInput,
  TakeoffDistanceRequiredWithSlopeOutput
>;

export const takeoffDistanceRequiredWithSlopeTool = createSimpleTool({
  id: "aviation/takeoff-distance-required-with-slope",
  title: "Takeoff Distance With Slope",
  description:
    "Apply a configurable linear runway-slope correction to a base takeoff distance. The default 10% distance change per 1% slope is a planning rule of thumb, not a substitute for the aircraft flight manual.",
  inputs: [
    {
      id: "baseDistanceM",
      label: "Base distance",
      kind: "number",
      unit: "m",
    },
    {
      default: 10,
      description:
        "Distance change for each percentage point of runway slope; use the value required by the applicable performance method.",
      id: "distanceChangePercentPerSlopePercent",
      label: "Correction per 1% slope",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Runway slope; positive values are uphill and lengthen.",
      id: "slopePercent",
      label: "Slope",
      kind: "number",
      maximum: 10,
      minimum: -10,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "takeoffDistanceMeters",
      label: "Takeoff distance",
      kind: "number",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const baseDistanceM = input.baseDistanceM as number;
    if (baseDistanceM <= 0)
      simpleError(
        "baseDistanceM",
        "The base distance must be greater than zero.",
      );
    const slopePercent = input.slopePercent as number;
    const correction = input.distanceChangePercentPerSlopePercent as number;
    const factor = 1 + (slopePercent * correction) / 100;
    if (factor <= 0)
      simpleError(
        "slopePercent",
        "The selected correction produces a non-positive takeoff distance.",
      );
    return { takeoffDistanceMeters: baseDistanceM * factor };
  },
});
export const runTakeoffDistanceRequiredWithSlope =
  takeoffDistanceRequiredWithSlopeTool.execute;
export default takeoffDistanceRequiredWithSlopeTool;
