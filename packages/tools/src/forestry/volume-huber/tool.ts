import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VolumeHuberInput = Readonly<{
  readonly midpointAreaSquareMeters: number;
  readonly logLengthMeters: number;
}>;
export type VolumeHuberOutput = Readonly<{
  readonly logCubicMeters: number;
}>;

export const calculateVolumeHuber = (
  x: VolumeHuberInput,
): VolumeHuberOutput => {
  if (
    !Number.isFinite(x.midpointAreaSquareMeters) ||
    x.midpointAreaSquareMeters < 0
  )
    simpleError(
      "midpointAreaSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.logLengthMeters) || x.logLengthMeters < 0)
    simpleError("logLengthMeters", "Provide a finite nonnegative number.");
  const logCubicMeters = x.midpointAreaSquareMeters * x.logLengthMeters;
  if (!Number.isFinite(logCubicMeters))
    simpleError(
      "logCubicMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { logCubicMeters: Object.is(logCubicMeters, -0) ? 0 : logCubicMeters };
};

export const example = {
  input: {
    midpointAreaSquareMeters: 0.1,
    logLengthMeters: 4,
  },
  output: { logCubicMeters: 0.4 },
} satisfies ToolExample<VolumeHuberInput, VolumeHuberOutput>;

export const tool = createSimpleTool({
  id: "forestry/volume-huber",
  title: "Volume Huber",
  description:
    "Log volume by Huber's rule: cross-sectional area at log midpoint times log length.",
  inputs: [
    {
      id: "midpointAreaSquareMeters",
      kind: "number",
      label: "Midpoint Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "logLengthMeters",
      kind: "number",
      label: "Log Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "logCubicMeters",
      kind: "number",
      label: "Log Cubic Meters",
      unit: "m3",
    },
  ],
  calculate: (input) =>
    calculateVolumeHuber({
      midpointAreaSquareMeters: input.midpointAreaSquareMeters as number,
      logLengthMeters: input.logLengthMeters as number,
    }),
});
export const volumeHuberTool = tool;
export const runVolumeHuber = tool.execute;
export default tool;
