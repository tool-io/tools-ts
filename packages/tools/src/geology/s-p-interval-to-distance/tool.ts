import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SPIntervalToDistanceInput = {
  readonly intervalSeconds: number;
  readonly pVelocityKmPerSecond: number;
  readonly sVelocityKmPerSecond: number;
};

export type SPIntervalToDistanceOutput = {
  readonly distanceKm: number;
};

export const calculateSPIntervalToDistance = (
  input: SPIntervalToDistanceInput,
): SPIntervalToDistanceOutput => {
  if (!(input.intervalSeconds >= 0))
    simpleError(
      "intervalSeconds",
      "The S-P interval must be non-negative.",
      "invalid_interval",
    );
  if (!(input.pVelocityKmPerSecond > 0))
    simpleError(
      "pVelocityKmPerSecond",
      "P-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.sVelocityKmPerSecond > 0))
    simpleError(
      "sVelocityKmPerSecond",
      "S-wave velocity must be greater than zero.",
      "invalid_velocity",
    );
  if (!(input.pVelocityKmPerSecond > input.sVelocityKmPerSecond))
    simpleError(
      "pVelocityKmPerSecond",
      "P-wave velocity must exceed S-wave velocity.",
      "invalid_velocity",
    );
  return {
    distanceKm:
      (input.intervalSeconds *
        (input.pVelocityKmPerSecond * input.sVelocityKmPerSecond)) /
      (input.pVelocityKmPerSecond - input.sVelocityKmPerSecond),
  };
};

export const spIntervalToDistanceExample = {
  input: {
    intervalSeconds: 10,
    pVelocityKmPerSecond: 6,
    sVelocityKmPerSecond: 3.5,
  },
  output: { distanceKm: 84 },
} satisfies ToolExample<SPIntervalToDistanceInput, SPIntervalToDistanceOutput>;

export const spIntervalToDistanceTool = createSimpleTool({
  id: "geology/s-p-interval-to-distance",
  title: "S-P Interval To Distance Calculator",
  description:
    "Epicentral distance from the S-minus-P arrival-time interval: d = dt * (vP * vS) / (vP - vS) for a common straight-ray path.",
  inputs: [
    {
      description: "S-P arrival-time interval in seconds.",
      id: "intervalSeconds",
      kind: "number",
      label: "S-P interval",
      minimum: 0,
    },
    {
      description: "P-wave velocity in kilometers per second.",
      id: "pVelocityKmPerSecond",
      kind: "number",
      label: "Vp",
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
      description: "Epicentral distance in kilometers.",
      id: "distanceKm",
      kind: "number",
      label: "Distance",
    },
  ],
  calculate: (input) =>
    calculateSPIntervalToDistance(
      input as unknown as SPIntervalToDistanceInput,
    ),
});

export const runSPIntervalToDistance = spIntervalToDistanceTool.execute;
export default spIntervalToDistanceTool;
