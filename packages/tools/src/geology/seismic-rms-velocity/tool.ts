import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicRmsVelocityInput = {
  readonly layerVelocitiesMPers: readonly number[];
  readonly layerIntervalTimesS: readonly number[];
};

export type SeismicRmsVelocityOutput = {
  readonly rmsVelocityMPers: number;
};

export const calculateSeismicRmsVelocity = (
  input: SeismicRmsVelocityInput,
): SeismicRmsVelocityOutput => {
  if (input.layerVelocitiesMPers.length !== input.layerIntervalTimesS.length)
    return simpleError(
      "layerIntervalTimesS",
      "The interval time list must have the same length as the velocity list.",
      "invalid_length",
    );
  if (input.layerVelocitiesMPers.length === 0)
    return simpleError(
      "layerVelocitiesMPers",
      "At least one layer is required.",
      "invalid_length",
    );
  for (const [index, velocity] of input.layerVelocitiesMPers.entries())
    if (!(velocity > 0))
      return simpleError(
        "layerVelocitiesMPers",
        `Layer velocity at index ${index} must be greater than zero.`,
        "invalid_velocity",
      );
  let totalTimeS = 0;
  let weightedSquareSum = 0;
  for (const [index, time] of input.layerIntervalTimesS.entries()) {
    if (!(time > 0))
      return simpleError(
        "layerIntervalTimesS",
        `Interval travel time at index ${index} must be greater than zero.`,
        "invalid_time",
      );
    totalTimeS += time;
    weightedSquareSum += input.layerVelocitiesMPers[index] ** 2 * time;
  }
  return { rmsVelocityMPers: Math.sqrt(weightedSquareSum / totalTimeS) };
};

export const seismicRmsVelocityExample = {
  input: {
    layerVelocitiesMPers: [1500, 2200],
    layerIntervalTimesS: [0.4, 0.6],
  },
  output: { rmsVelocityMPers: 1950.3845774615836 },
} satisfies ToolExample<SeismicRmsVelocityInput, SeismicRmsVelocityOutput>;

export const seismicRmsVelocityTool = createSimpleTool({
  id: "geology/seismic-rms-velocity",
  title: "Seismic Rms Velocity Calculator",
  description:
    "Layer-root-mean-square velocity Vrms^2 = sum(Vi^2 ti) / sum(ti) from per-layer velocities in meters per second and one-way interval travel times in seconds.",
  inputs: [
    {
      description: "Interval velocities of each layer in meters per second.",
      id: "layerVelocitiesMPers",
      kind: "numberList",
      label: "Vi",
    },
    {
      description:
        "One-way interval travel times through each layer in seconds.",
      id: "layerIntervalTimesS",
      kind: "numberList",
      label: "ti",
    },
  ],
  outputs: [
    {
      description: "Root-mean-square velocity in meters per second.",
      id: "rmsVelocityMPers",
      kind: "number",
      label: "Vrms",
    },
  ],
  calculate: (input) =>
    calculateSeismicRmsVelocity(input as unknown as SeismicRmsVelocityInput),
});

export const runSeismicRmsVelocity = seismicRmsVelocityTool.execute;
export default seismicRmsVelocityTool;
