import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TravelTimePWaveInput = {
  readonly distanceKm: number;
  readonly pVelocityKmPerSecond: number;
};

export type TravelTimePWaveOutput = {
  readonly timeSeconds: number;
};

export const calculateTravelTimePWave = (
  input: TravelTimePWaveInput,
): TravelTimePWaveOutput => {
  if (!(input.distanceKm >= 0))
    simpleError(
      "distanceKm",
      "Distance must be non-negative.",
      "invalid_distance",
    );
  if (!(input.pVelocityKmPerSecond > 0))
    simpleError(
      "pVelocityKmPerSecond",
      "P-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  return { timeSeconds: input.distanceKm / input.pVelocityKmPerSecond };
};

export const travelTimePWaveExample = {
  input: { distanceKm: 100, pVelocityKmPerSecond: 6 },
  output: { timeSeconds: 16.666666666666668 },
} satisfies ToolExample<TravelTimePWaveInput, TravelTimePWaveOutput>;

export const travelTimePWaveTool = createSimpleTool({
  id: "geology/travel-time-p-wave",
  title: "Travel Time P Wave Calculator",
  description:
    "Straight-ray P-wave first-arrival time t = d / vP with distance and velocity in kilometers and kilometers per second.",
  inputs: [
    {
      description: "Path length in kilometers.",
      id: "distanceKm",
      kind: "number",
      label: "Distance",
      minimum: 0,
    },
    {
      description: "P-wave velocity in kilometers per second.",
      id: "pVelocityKmPerSecond",
      kind: "number",
      label: "Vp",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "P-wave travel time in seconds.",
      id: "timeSeconds",
      kind: "number",
      label: "Travel time",
    },
  ],
  calculate: (input) =>
    calculateTravelTimePWave(input as unknown as TravelTimePWaveInput),
});

export const runTravelTimePWave = travelTimePWaveTool.execute;
export default travelTimePWaveTool;
