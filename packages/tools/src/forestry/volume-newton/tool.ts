import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VolumeNewtonInput = Readonly<{
  readonly smallEndAreaSquareMeters: number;
  readonly midpointAreaSquareMeters: number;
  readonly largeEndAreaSquareMeters: number;
  readonly logLengthMeters: number;
}>;
export type VolumeNewtonOutput = Readonly<{
  readonly logCubicMeters: number;
}>;

export const calculateVolumeNewton = (
  x: VolumeNewtonInput,
): VolumeNewtonOutput => {
  if (
    !Number.isFinite(x.smallEndAreaSquareMeters) ||
    x.smallEndAreaSquareMeters < 0
  )
    simpleError(
      "smallEndAreaSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.midpointAreaSquareMeters) ||
    x.midpointAreaSquareMeters < 0
  )
    simpleError(
      "midpointAreaSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.largeEndAreaSquareMeters) ||
    x.largeEndAreaSquareMeters < 0
  )
    simpleError(
      "largeEndAreaSquareMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.logLengthMeters) || x.logLengthMeters < 0)
    simpleError("logLengthMeters", "Provide a finite nonnegative number.");
  const logCubicMeters =
    ((x.smallEndAreaSquareMeters +
      4 * x.midpointAreaSquareMeters +
      x.largeEndAreaSquareMeters) *
      x.logLengthMeters) /
    6;
  if (!Number.isFinite(logCubicMeters))
    simpleError(
      "logCubicMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { logCubicMeters: Object.is(logCubicMeters, -0) ? 0 : logCubicMeters };
};

export const example = {
  input: {
    smallEndAreaSquareMeters: 0.08,
    midpointAreaSquareMeters: 0.1,
    largeEndAreaSquareMeters: 0.12,
    logLengthMeters: 4,
  },
  output: { logCubicMeters: 0.4000000000000001 },
} satisfies ToolExample<VolumeNewtonInput, VolumeNewtonOutput>;

export const tool = createSimpleTool({
  id: "forestry/volume-newton",
  title: "Volume Newton",
  description:
    "Log volume by Newton's rule from the small-end, midpoint and large-end cross-sectional areas.",
  inputs: [
    {
      id: "smallEndAreaSquareMeters",
      kind: "number",
      label: "Small End Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "midpointAreaSquareMeters",
      kind: "number",
      label: "Midpoint Area Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "largeEndAreaSquareMeters",
      kind: "number",
      label: "Large End Area Square Meters",
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
    calculateVolumeNewton({
      smallEndAreaSquareMeters: input.smallEndAreaSquareMeters as number,
      midpointAreaSquareMeters: input.midpointAreaSquareMeters as number,
      largeEndAreaSquareMeters: input.largeEndAreaSquareMeters as number,
      logLengthMeters: input.logLengthMeters as number,
    }),
});
export const volumeNewtonTool = tool;
export const runVolumeNewton = tool.execute;
export default tool;
