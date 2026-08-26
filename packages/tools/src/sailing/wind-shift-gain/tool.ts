import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindShiftGainInput = {
  readonly liftDegrees: number;
  readonly distanceSailedMeters: number;
};

export type WindShiftGainOutput = {
  readonly lateralGainMeters: number;
};

export const calculateWindShiftGain = (
  liftDegrees: number,
  distanceSailedMeters: number,
): number | null =>
  Number.isFinite(liftDegrees) &&
  liftDegrees >= -45 &&
  liftDegrees <= 45 &&
  Number.isFinite(distanceSailedMeters) &&
  distanceSailedMeters >= 0
    ? Math.tan(liftDegrees * (Math.PI / 180)) * distanceSailedMeters
    : null;

export const windShiftGainExample = {
  input: { liftDegrees: 20, distanceSailedMeters: 100 },
  output: { lateralGainMeters: 36.39702342662024 },
} satisfies ToolExample<WindShiftGainInput, WindShiftGainOutput>;

export const windShiftGainTool = createSimpleTool({
  id: "sailing/wind-shift-gain",
  title: "Wind Shift Gain Calculator",
  description:
    "Estimate the lateral gain from a persistent wind shift over the distance sailed, with positive lifts gaining and headers losing.",
  inputs: [
    { id: "liftDegrees", kind: "number", label: "Lift", unit: "°" },
    {
      id: "distanceSailedMeters",
      kind: "number",
      label: "Distance sailed",
      unit: "m",
    },
  ],
  outputs: [
    {
      format: "distance-m",
      id: "lateralGainMeters",
      kind: "number",
      label: "Lateral gain",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const lift = input.liftDegrees as number;
    const distance = input.distanceSailedMeters as number;
    const lateralGainMeters = calculateWindShiftGain(lift, distance);
    if (lateralGainMeters === null)
      simpleError(
        distance < 0 ? "distanceSailedMeters" : "liftDegrees",
        "Enter a lift between negative and positive forty-five degrees and a non-negative distance.",
        distance < 0 ? "invalid_distance" : "invalid_shift",
      );
    return { lateralGainMeters };
  },
});

export const runWindShiftGain = windShiftGainTool.execute;
export default windShiftGainTool;
