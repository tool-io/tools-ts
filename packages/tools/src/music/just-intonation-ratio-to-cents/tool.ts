import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JustIntonationRatioToCentsInput = Readonly<{
  readonly ratioNumerator: number;
  readonly ratioDenominator: number;
}>;
export type JustIntonationRatioToCentsOutput = Readonly<{
  readonly cents: number;
}>;

export const calculateJustIntonationRatioToCents = (
  x: JustIntonationRatioToCentsInput,
): JustIntonationRatioToCentsOutput => {
  if (!Number.isFinite(x.ratioNumerator) || x.ratioNumerator <= 0)
    simpleError("ratioNumerator", "Provide a finite positive number.");
  if (!Number.isFinite(x.ratioDenominator) || x.ratioDenominator <= 0)
    simpleError("ratioDenominator", "Provide a finite positive number.");
  const cents = 1200 * Math.log2(x.ratioNumerator / x.ratioDenominator);
  if (!Number.isFinite(cents))
    simpleError("cents", "Inputs produce an undefined or out-of-range result.");
  return { cents: Object.is(cents, -0) ? 0 : cents };
};

export const example = {
  input: {
    ratioNumerator: 3,
    ratioDenominator: 2,
  },
  output: { cents: 701.9550008653874 },
} satisfies ToolExample<
  JustIntonationRatioToCentsInput,
  JustIntonationRatioToCentsOutput
>;

export const tool = createSimpleTool({
  id: "music/just-intonation-ratio-to-cents",
  title: "Just Intonation Ratio To Cents",
  description:
    "Pitch interval in cents for a positive just-intonation frequency ratio numerator/denominator.",
  inputs: [
    {
      id: "ratioNumerator",
      kind: "number",
      label: "Ratio Numerator",
      minimum: 0,
    },
    {
      id: "ratioDenominator",
      kind: "number",
      label: "Ratio Denominator",
      minimum: 0,
    },
  ],
  outputs: [{ id: "cents", kind: "number", label: "Cents", unit: "cent" }],
  calculate: (input) =>
    calculateJustIntonationRatioToCents({
      ratioNumerator: input.ratioNumerator as number,
      ratioDenominator: input.ratioDenominator as number,
    }),
});
export const justIntonationRatioToCentsTool = tool;
export const runJustIntonationRatioToCents = tool.execute;
export default tool;
