import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NoiseMetricSelFromEventLeqInput = Readonly<{
  readonly eventLeqDecibels: number;
  readonly eventSeconds: number;
}>;
export type NoiseMetricSelFromEventLeqOutput = Readonly<{
  readonly selDecibels: number;
}>;

export const calculateNoiseMetricSelFromEventLeq = (
  x: NoiseMetricSelFromEventLeqInput,
): NoiseMetricSelFromEventLeqOutput => {
  if (!Number.isFinite(x.eventLeqDecibels))
    simpleError("eventLeqDecibels", "Provide a finite number.");
  if (!Number.isFinite(x.eventSeconds) || x.eventSeconds <= 0)
    simpleError("eventSeconds", "Provide a finite positive number.");
  const selDecibels = x.eventLeqDecibels + 10 * Math.log10(x.eventSeconds);
  if (!Number.isFinite(selDecibels))
    simpleError(
      "selDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { selDecibels: Object.is(selDecibels, -0) ? 0 : selDecibels };
};

export const example = {
  input: {
    eventLeqDecibels: 80,
    eventSeconds: 10,
  },
  output: { selDecibels: 90 },
} satisfies ToolExample<
  NoiseMetricSelFromEventLeqInput,
  NoiseMetricSelFromEventLeqOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/noise-metric-sel-from-event-leq",
  title: "Noise Metric Sel From Event Leq",
  description:
    "Sound exposure level from event Leq and measured event duration relative to one second.",
  inputs: [
    {
      id: "eventLeqDecibels",
      kind: "number",
      label: "Event Leq Decibels",
      unit: "dB",
    },
    {
      id: "eventSeconds",
      kind: "number",
      label: "Event Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "selDecibels", kind: "number", label: "Sel Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateNoiseMetricSelFromEventLeq({
      eventLeqDecibels: input.eventLeqDecibels as number,
      eventSeconds: input.eventSeconds as number,
    }),
});
export const noiseMetricSelFromEventLeqTool = tool;
export const runNoiseMetricSelFromEventLeq = tool.execute;
export default tool;
