import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrameTimeBudgetMsInput = Readonly<{
  readonly refreshHertz: number;
}>;
export type FrameTimeBudgetMsOutput = Readonly<{
  readonly millisecondsPerFrame: number;
}>;

export const calculateFrameTimeBudgetMs = (
  x: FrameTimeBudgetMsInput,
): FrameTimeBudgetMsOutput => {
  if (!Number.isFinite(x.refreshHertz) || x.refreshHertz <= 0)
    simpleError("refreshHertz", "Provide a finite positive number.");
  const millisecondsPerFrame = 1000 / x.refreshHertz;
  if (!Number.isFinite(millisecondsPerFrame))
    simpleError(
      "millisecondsPerFrame",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    millisecondsPerFrame: Object.is(millisecondsPerFrame, -0)
      ? 0
      : millisecondsPerFrame,
  };
};

export const example = {
  input: {
    refreshHertz: 90,
  },
  output: { millisecondsPerFrame: 11.11111111111111 },
} satisfies ToolExample<FrameTimeBudgetMsInput, FrameTimeBudgetMsOutput>;

export const tool = createSimpleTool({
  id: "vr/frame-time-budget-ms",
  title: "Frame Time Budget Ms",
  description:
    "Milliseconds available per display refresh from target refresh rate in hertz.",
  inputs: [
    {
      id: "refreshHertz",
      kind: "number",
      label: "Refresh Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "millisecondsPerFrame",
      kind: "number",
      label: "Milliseconds Per Frame",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateFrameTimeBudgetMs({
      refreshHertz: input.refreshHertz as number,
    }),
});
export const frameTimeBudgetMsTool = tool;
export const runFrameTimeBudgetMs = tool.execute;
export default tool;
