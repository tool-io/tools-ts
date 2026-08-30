import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ControllerLatencyInput = Readonly<{
  readonly scanMilliseconds: number;
  readonly transportMilliseconds: number;
  readonly processingMilliseconds: number;
}>;
export type ControllerLatencyOutput = Readonly<{
  readonly latencyMilliseconds: number;
}>;

export const calculateControllerLatency = (
  x: ControllerLatencyInput,
): ControllerLatencyOutput => {
  if (!Number.isFinite(x.scanMilliseconds) || x.scanMilliseconds < 0)
    simpleError("scanMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.transportMilliseconds) || x.transportMilliseconds < 0)
    simpleError(
      "transportMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.processingMilliseconds) ||
    x.processingMilliseconds < 0
  )
    simpleError(
      "processingMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const latencyMilliseconds =
    x.scanMilliseconds + x.transportMilliseconds + x.processingMilliseconds;
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
    scanMilliseconds: 2,
    transportMilliseconds: 3,
    processingMilliseconds: 1,
  },
  output: { latencyMilliseconds: 6 },
} satisfies ToolExample<ControllerLatencyInput, ControllerLatencyOutput>;

export const tool = createSimpleTool({
  id: "vr/controller-latency",
  title: "Controller Latency",
  description:
    "Serial controller input latency from scan, transport, and processing stages.",
  inputs: [
    {
      id: "scanMilliseconds",
      kind: "number",
      label: "Scan Milliseconds",
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
    {
      id: "processingMilliseconds",
      kind: "number",
      label: "Processing Milliseconds",
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
    calculateControllerLatency({
      scanMilliseconds: input.scanMilliseconds as number,
      transportMilliseconds: input.transportMilliseconds as number,
      processingMilliseconds: input.processingMilliseconds as number,
    }),
});
export const controllerLatencyTool = tool;
export const runControllerLatency = tool.execute;
export default tool;
