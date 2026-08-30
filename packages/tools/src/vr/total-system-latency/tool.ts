import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalSystemLatencyInput = Readonly<{
  readonly trackingMilliseconds: number;
  readonly renderMilliseconds: number;
  readonly displayMilliseconds: number;
}>;
export type TotalSystemLatencyOutput = Readonly<{
  readonly totalMilliseconds: number;
}>;

export const calculateTotalSystemLatency = (
  x: TotalSystemLatencyInput,
): TotalSystemLatencyOutput => {
  if (!Number.isFinite(x.trackingMilliseconds) || x.trackingMilliseconds < 0)
    simpleError("trackingMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.renderMilliseconds) || x.renderMilliseconds < 0)
    simpleError("renderMilliseconds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.displayMilliseconds) || x.displayMilliseconds < 0)
    simpleError("displayMilliseconds", "Provide a finite nonnegative number.");
  const totalMilliseconds =
    x.trackingMilliseconds + x.renderMilliseconds + x.displayMilliseconds;
  if (!Number.isFinite(totalMilliseconds))
    simpleError(
      "totalMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalMilliseconds: Object.is(totalMilliseconds, -0) ? 0 : totalMilliseconds,
  };
};

export const example = {
  input: {
    trackingMilliseconds: 6,
    renderMilliseconds: 9,
    displayMilliseconds: 7,
  },
  output: { totalMilliseconds: 22 },
} satisfies ToolExample<TotalSystemLatencyInput, TotalSystemLatencyOutput>;

export const tool = createSimpleTool({
  id: "vr/total-system-latency",
  title: "Total System Latency",
  description:
    "Serial latency estimate from tracking, rendering and display stages; excludes unmodelled parallel overlap.",
  inputs: [
    {
      id: "trackingMilliseconds",
      kind: "number",
      label: "Tracking Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "renderMilliseconds",
      kind: "number",
      label: "Render Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "displayMilliseconds",
      kind: "number",
      label: "Display Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalMilliseconds",
      kind: "number",
      label: "Total Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateTotalSystemLatency({
      trackingMilliseconds: input.trackingMilliseconds as number,
      renderMilliseconds: input.renderMilliseconds as number,
      displayMilliseconds: input.displayMilliseconds as number,
    }),
});
export const totalSystemLatencyTool = tool;
export const runTotalSystemLatency = tool.execute;
export default tool;
