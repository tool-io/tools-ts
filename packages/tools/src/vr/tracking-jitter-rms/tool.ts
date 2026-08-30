import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrackingJitterRmsInput = Readonly<{
  readonly xRmsMillimeters: number;
  readonly yRmsMillimeters: number;
  readonly zRmsMillimeters: number;
}>;
export type TrackingJitterRmsOutput = Readonly<{
  readonly rmsMagnitudeMillimeters: number;
}>;

export const calculateTrackingJitterRms = (
  x: TrackingJitterRmsInput,
): TrackingJitterRmsOutput => {
  if (!Number.isFinite(x.xRmsMillimeters) || x.xRmsMillimeters < 0)
    simpleError("xRmsMillimeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.yRmsMillimeters) || x.yRmsMillimeters < 0)
    simpleError("yRmsMillimeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.zRmsMillimeters) || x.zRmsMillimeters < 0)
    simpleError("zRmsMillimeters", "Provide a finite nonnegative number.");
  const rmsMagnitudeMillimeters = Math.hypot(
    x.xRmsMillimeters,
    x.yRmsMillimeters,
    x.zRmsMillimeters,
  );
  if (!Number.isFinite(rmsMagnitudeMillimeters))
    simpleError(
      "rmsMagnitudeMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    rmsMagnitudeMillimeters: Object.is(rmsMagnitudeMillimeters, -0)
      ? 0
      : rmsMagnitudeMillimeters,
  };
};

export const example = {
  input: {
    xRmsMillimeters: 1,
    yRmsMillimeters: 2,
    zRmsMillimeters: 2,
  },
  output: { rmsMagnitudeMillimeters: 3 },
} satisfies ToolExample<TrackingJitterRmsInput, TrackingJitterRmsOutput>;

export const tool = createSimpleTool({
  id: "vr/tracking-jitter-rms",
  title: "Tracking Jitter Rms",
  description:
    "Three-axis tracking jitter magnitude from per-axis RMS position errors in millimetres.",
  inputs: [
    {
      id: "xRmsMillimeters",
      kind: "number",
      label: "X Rms Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "yRmsMillimeters",
      kind: "number",
      label: "Y Rms Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "zRmsMillimeters",
      kind: "number",
      label: "Z Rms Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rmsMagnitudeMillimeters",
      kind: "number",
      label: "Rms Magnitude Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTrackingJitterRms({
      xRmsMillimeters: input.xRmsMillimeters as number,
      yRmsMillimeters: input.yRmsMillimeters as number,
      zRmsMillimeters: input.zRmsMillimeters as number,
    }),
});
export const trackingJitterRmsTool = tool;
export const runTrackingJitterRms = tool.execute;
export default tool;
