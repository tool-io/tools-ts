import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HapticFeedbackLatencyInput = Readonly<{
  readonly processingMilliseconds: number;
  readonly transportMilliseconds: number;
  readonly actuatorOnsetMilliseconds: number;
}>;
export type HapticFeedbackLatencyOutput = Readonly<{
  readonly latencyMilliseconds: number;
}>;

export const calculateHapticFeedbackLatency = (
  x: HapticFeedbackLatencyInput,
): HapticFeedbackLatencyOutput => {
  if (
    !Number.isFinite(x.processingMilliseconds) ||
    x.processingMilliseconds < 0
  )
    simpleError(
      "processingMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.transportMilliseconds) || x.transportMilliseconds < 0)
    simpleError(
      "transportMilliseconds",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.actuatorOnsetMilliseconds) ||
    x.actuatorOnsetMilliseconds < 0
  )
    simpleError(
      "actuatorOnsetMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const latencyMilliseconds =
    x.processingMilliseconds +
    x.transportMilliseconds +
    x.actuatorOnsetMilliseconds;
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
    processingMilliseconds: 1,
    transportMilliseconds: 2,
    actuatorOnsetMilliseconds: 5,
  },
  output: { latencyMilliseconds: 8 },
} satisfies ToolExample<
  HapticFeedbackLatencyInput,
  HapticFeedbackLatencyOutput
>;

export const tool = createSimpleTool({
  id: "vr/haptic-feedback-latency",
  title: "Haptic Feedback Latency",
  description:
    "Serial haptic latency from command processing, transport, and actuator onset.",
  inputs: [
    {
      id: "processingMilliseconds",
      kind: "number",
      label: "Processing Milliseconds",
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
      id: "actuatorOnsetMilliseconds",
      kind: "number",
      label: "Actuator Onset Milliseconds",
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
    calculateHapticFeedbackLatency({
      processingMilliseconds: input.processingMilliseconds as number,
      transportMilliseconds: input.transportMilliseconds as number,
      actuatorOnsetMilliseconds: input.actuatorOnsetMilliseconds as number,
    }),
});
export const hapticFeedbackLatencyTool = tool;
export const runHapticFeedbackLatency = tool.execute;
export default tool;
