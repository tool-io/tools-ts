import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { calculateDensityRatio } from "../density-ratio/tool.js";

export type StallSpeedAltitudeInput = {
  readonly pressureAltitudeFt: number;
  readonly seaLevelStallSpeedKt: number;
};

export type StallSpeedAltitudeOutput = {
  readonly stallSpeedKt: number;
};

export const stallSpeedAltitudeExample = {
  input: { pressureAltitudeFt: 5000, seaLevelStallSpeedKt: 50 },
  output: { stallSpeedKt: 53.8643069037 },
} satisfies ToolExample<StallSpeedAltitudeInput, StallSpeedAltitudeOutput>;

export const calculateStallSpeedAltitude = (
  input: StallSpeedAltitudeInput,
): StallSpeedAltitudeOutput => {
  if (input.seaLevelStallSpeedKt <= 0)
    simpleError(
      "seaLevelStallSpeedKt",
      "The stall speed must be positive.",
      "invalid_speed",
    );
  const densityRatio = calculateDensityRatio({
    altitudeFt: input.pressureAltitudeFt,
  }).densityRatio;
  return {
    stallSpeedKt: roundStatistic(
      input.seaLevelStallSpeedKt / Math.sqrt(densityRatio),
    ),
  };
};

export const stallSpeedAltitudeTool = createSimpleTool({
  calculate: (input) =>
    calculateStallSpeedAltitude(input as unknown as StallSpeedAltitudeInput),
  description:
    "Compute how the stall speed increases with altitude as the air density drops.",
  id: "aviation/stall-speed-altitude",
  inputs: [
    {
      description:
        "Pressure altitude of the observation in the standard atmosphere.",
      id: "pressureAltitudeFt",
      kind: "number",
      label: "Pressure altitude",
      unit: "ft",
    },
    {
      description: "Sea-level stall speed.",
      id: "seaLevelStallSpeedKt",
      kind: "number",
      label: "Sea-level stall speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "True stall speed at that density altitude.",
      format: "speed",
      id: "stallSpeedKt",
      kind: "number",
      label: "Stall speed",
      unit: "kt",
    },
  ],
  title: "Stall Speed Altitude Correction Calculator",
});
export const runStallSpeedAltitude = stallSpeedAltitudeTool.execute;
export default stallSpeedAltitudeTool;
