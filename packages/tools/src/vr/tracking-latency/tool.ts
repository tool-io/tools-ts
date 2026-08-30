import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrackingLatencyInput = Readonly<{
  readonly captureMilliseconds: number;
  readonly computationMilliseconds: number;
  readonly transportMilliseconds: number;
}>;
export type TrackingLatencyOutput = Readonly<{
  readonly trackingMilliseconds: number;
}>;

export const calculateTrackingLatency = (
  x: TrackingLatencyInput,
): TrackingLatencyOutput => {
  if (!Number.isFinite(x.captureMilliseconds) || x.captureMilliseconds < 0)
    simpleError("captureMilliseconds", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.computationMilliseconds) ||
    x.computationMilliseconds < 0
  )
    simpleError(
      "computationMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.transportMilliseconds) || x.transportMilliseconds < 0)
    simpleError(
      "transportMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const trackingMilliseconds =
    x.captureMilliseconds + x.computationMilliseconds + x.transportMilliseconds;
  if (!Number.isFinite(trackingMilliseconds))
    simpleError(
      "trackingMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    trackingMilliseconds: Object.is(trackingMilliseconds, -0)
      ? 0
      : trackingMilliseconds,
  };
};

export const example = {
  input: {
    captureMilliseconds: 2,
    computationMilliseconds: 3,
    transportMilliseconds: 1,
  },
  output: { trackingMilliseconds: 6 },
} satisfies ToolExample<TrackingLatencyInput, TrackingLatencyOutput>;

export const tool = createSimpleTool({
  id: "vr/tracking-latency",
  title: "Tracking Latency",
  description:
    "Serial tracking pipeline latency from sensor capture, pose computation and transport.",
  inputs: [
    {
      id: "captureMilliseconds",
      kind: "number",
      label: "Capture Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "computationMilliseconds",
      kind: "number",
      label: "Computation Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "transportMilliseconds",
      kind: "number",
      label: "Transport Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "trackingMilliseconds",
      kind: "number",
      label: "Tracking Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateTrackingLatency({
      captureMilliseconds: input.captureMilliseconds as number,
      computationMilliseconds: input.computationMilliseconds as number,
      transportMilliseconds: input.transportMilliseconds as number,
    }),
});
export const trackingLatencyTool = tool;
export const runTrackingLatency = tool.execute;
export default tool;
