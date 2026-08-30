import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IntervalRatioToCentsInput = Readonly<{
  readonly frequencyRatio: number;
}>;
export type IntervalRatioToCentsOutput = Readonly<{
  readonly cents: number;
}>;

export const calculateIntervalRatioToCents = (
  x: IntervalRatioToCentsInput,
): IntervalRatioToCentsOutput => {
  if (!Number.isFinite(x.frequencyRatio) || x.frequencyRatio <= 0)
    simpleError("frequencyRatio", "Provide a finite positive number.");
  const cents = 1200 * Math.log2(x.frequencyRatio);
  if (!Number.isFinite(cents))
    simpleError("cents", "Inputs produce an undefined or out-of-range result.");
  return { cents: Object.is(cents, -0) ? 0 : cents };
};

export const example = {
  input: {
    frequencyRatio: 2,
  },
  output: { cents: 1200 },
} satisfies ToolExample<IntervalRatioToCentsInput, IntervalRatioToCentsOutput>;

export const tool = createSimpleTool({
  id: "acoustics/interval-ratio-to-cents",
  title: "Interval Ratio To Cents",
  description: "Musical interval in cents from a positive frequency ratio.",
  inputs: [
    {
      id: "frequencyRatio",
      kind: "number",
      label: "Frequency Ratio",
      minimum: 0,
    },
  ],
  outputs: [{ id: "cents", kind: "number", label: "Cents", unit: "cent" }],
  calculate: (input) =>
    calculateIntervalRatioToCents({
      frequencyRatio: input.frequencyRatio as number,
    }),
});
export const intervalRatioToCentsTool = tool;
export const runIntervalRatioToCents = tool.execute;
export default tool;
