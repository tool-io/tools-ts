import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SampleBufferLatencyMsInput = Readonly<{
  readonly bufferFrames: number;
  readonly sampleRateHertz: number;
}>;
export type SampleBufferLatencyMsOutput = Readonly<{
  readonly latencyMilliseconds: number;
}>;

export const calculateSampleBufferLatencyMs = (
  x: SampleBufferLatencyMsInput,
): SampleBufferLatencyMsOutput => {
  if (!Number.isFinite(x.bufferFrames) || x.bufferFrames < 0)
    simpleError("bufferFrames", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.sampleRateHertz) || x.sampleRateHertz <= 0)
    simpleError("sampleRateHertz", "Provide a finite positive number.");
  if (!Number.isInteger(x.bufferFrames))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const latencyMilliseconds = (1000 * x.bufferFrames) / x.sampleRateHertz;
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
    bufferFrames: 480,
    sampleRateHertz: 48000,
  },
  output: { latencyMilliseconds: 10 },
} satisfies ToolExample<
  SampleBufferLatencyMsInput,
  SampleBufferLatencyMsOutput
>;

export const tool = createSimpleTool({
  id: "music/sample-buffer-latency-ms",
  title: "Sample Buffer Latency Ms",
  description:
    "One-way buffer duration in milliseconds from sample frames and sample rate; excludes conversion and OS overhead.",
  inputs: [
    {
      id: "bufferFrames",
      kind: "number",
      label: "Buffer Frames",
      unit: "frames",
      minimum: 0,
    },
    {
      id: "sampleRateHertz",
      kind: "number",
      label: "Sample Rate Hertz",
      unit: "Hz",
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
    calculateSampleBufferLatencyMs({
      bufferFrames: input.bufferFrames as number,
      sampleRateHertz: input.sampleRateHertz as number,
    }),
});
export const sampleBufferLatencyMsTool = tool;
export const runSampleBufferLatencyMs = tool.execute;
export default tool;
