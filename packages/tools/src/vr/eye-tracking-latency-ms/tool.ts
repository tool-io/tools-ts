import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EyeTrackingLatencyMsInput = Readonly<{
  readonly exposureMilliseconds: number;
  readonly inferenceMilliseconds: number;
  readonly transportMilliseconds: number;
}>;
export type EyeTrackingLatencyMsOutput = Readonly<{
  readonly latencyMilliseconds: number;
}>;

export const calculateEyeTrackingLatencyMs = (
  x: EyeTrackingLatencyMsInput,
): EyeTrackingLatencyMsOutput => {
  if (!Number.isFinite(x.exposureMilliseconds) || x.exposureMilliseconds < 0)
    simpleError("exposureMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.inferenceMilliseconds) || x.inferenceMilliseconds < 0)
    simpleError(
      "inferenceMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.transportMilliseconds) || x.transportMilliseconds < 0)
    simpleError(
      "transportMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const latencyMilliseconds =
    x.exposureMilliseconds + x.inferenceMilliseconds + x.transportMilliseconds;
  if (!Number.isFinite(latencyMilliseconds))
    simpleError(
      "latencyMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    latencyMilliseconds: Object.is(latencyMilliseconds, -0)
      ? 0
      : latencyMilliseconds,
  };
};

export const example = {
  input: {
    exposureMilliseconds: 2,
    inferenceMilliseconds: 5,
    transportMilliseconds: 1,
  },
  output: { latencyMilliseconds: 8 },
} satisfies ToolExample<EyeTrackingLatencyMsInput, EyeTrackingLatencyMsOutput>;

export const tool = createSimpleTool({
  id: "vr/eye-tracking-latency-ms",
  title: "Eye Tracking Latency Ms",
  description:
    "Serial eye-tracking latency from exposure, gaze inference, and output transport.",
  inputs: [
    {
      id: "exposureMilliseconds",
      kind: "number",
      label: "Exposure Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "inferenceMilliseconds",
      kind: "number",
      label: "Inference Milliseconds",
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
      id: "latencyMilliseconds",
      kind: "number",
      label: "Latency Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateEyeTrackingLatencyMs({
      exposureMilliseconds: input.exposureMilliseconds as number,
      inferenceMilliseconds: input.inferenceMilliseconds as number,
      transportMilliseconds: input.transportMilliseconds as number,
    }),
});
export const eyeTrackingLatencyMsTool = tool;
export const runEyeTrackingLatencyMs = tool.execute;
export default tool;
