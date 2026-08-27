import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TravelTimeSWaveInput = {
  readonly distanceKm: number;
  readonly sVelocityKmPerSecond: number;
};

export type TravelTimeSWaveOutput = {
  readonly timeSeconds: number;
};

export const calculateTravelTimeSWave = (
  input: TravelTimeSWaveInput,
): TravelTimeSWaveOutput => {
  if (!(input.distanceKm >= 0))
    simpleError(
      "distanceKm",
      "Distance must be non-negative.",
      "invalid_distance",
    );
  if (!(input.sVelocityKmPerSecond > 0))
    simpleError(
      "sVelocityKmPerSecond",
      "S-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  return { timeSeconds: input.distanceKm / input.sVelocityKmPerSecond };
};

export const travelTimeSWaveExample = {
  input: { distanceKm: 100, sVelocityKmPerSecond: 3.5 },
  output: { timeSeconds: 28.571428571428573 },
} satisfies ToolExample<TravelTimeSWaveInput, TravelTimeSWaveOutput>;

export const travelTimeSWaveTool = createSimpleTool({
  id: "geology/travel-time-s-wave",
  title: "Travel Time S Wave Calculator",
  description:
    "Straight-ray S-wave arrival time t = d / vS with distance and velocity in kilometers and kilometers per second.",
  inputs: [
    {
      description: "Path length in kilometers.",
      id: "distanceKm",
      kind: "number",
      label: "Distance",
      minimum: 0,
    },
    {
      description: "S-wave velocity in kilometers per second.",
      id: "sVelocityKmPerSecond",
      kind: "number",
      label: "Vs",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "S-wave travel time in seconds.",
      id: "timeSeconds",
      kind: "number",
      label: "Travel time",
    },
  ],
  calculate: (input) =>
    calculateTravelTimeSWave(input as unknown as TravelTimeSWaveInput),
});

export const runTravelTimeSWave = travelTimeSWaveTool.execute;
export default travelTimeSWaveTool;
