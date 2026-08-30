import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayLatencyInput = Readonly<{
  readonly scanoutMilliseconds: number;
  readonly pixelResponseMilliseconds: number;
}>;
export type DisplayLatencyOutput = Readonly<{
  readonly displayMilliseconds: number;
}>;

export const calculateDisplayLatency = (
  x: DisplayLatencyInput,
): DisplayLatencyOutput => {
  if (!Number.isFinite(x.scanoutMilliseconds) || x.scanoutMilliseconds < 0)
    simpleError("scanoutMilliseconds", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.pixelResponseMilliseconds) ||
    x.pixelResponseMilliseconds < 0
  )
    simpleError(
      "pixelResponseMilliseconds",
      "Provide a finite nonnegative number.",
    );
  const displayMilliseconds =
    x.scanoutMilliseconds + x.pixelResponseMilliseconds;
  if (!Number.isFinite(displayMilliseconds))
    simpleError(
      "displayMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    displayMilliseconds: Object.is(displayMilliseconds, -0)
      ? 0
      : displayMilliseconds,
  };
};

export const example = {
  input: {
    scanoutMilliseconds: 5,
    pixelResponseMilliseconds: 2,
  },
  output: { displayMilliseconds: 7 },
} satisfies ToolExample<DisplayLatencyInput, DisplayLatencyOutput>;

export const tool = createSimpleTool({
  id: "vr/display-latency",
  title: "Display Latency",
  description:
    "Display latency estimate from scanout delay and pixel response time.",
  inputs: [
    {
      id: "scanoutMilliseconds",
      kind: "number",
      label: "Scanout Milliseconds",
      unit: "ms",
      minimum: 0,
    },
    {
      id: "pixelResponseMilliseconds",
      kind: "number",
      label: "Pixel Response Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "displayMilliseconds",
      kind: "number",
      label: "Display Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateDisplayLatency({
      scanoutMilliseconds: input.scanoutMilliseconds as number,
      pixelResponseMilliseconds: input.pixelResponseMilliseconds as number,
    }),
});
export const displayLatencyTool = tool;
export const runDisplayLatency = tool.execute;
export default tool;
