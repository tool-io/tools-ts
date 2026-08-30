import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReductionNewScaleInput = Readonly<{
  readonly originalDenominator: number;
  readonly linearReductionFactor: number;
}>;
export type ReductionNewScaleOutput = Readonly<{
  readonly newDenominator: number;
}>;

export const calculateReductionNewScale = (
  x: ReductionNewScaleInput,
): ReductionNewScaleOutput => {
  if (!Number.isFinite(x.originalDenominator) || x.originalDenominator <= 0)
    simpleError("originalDenominator", "Provide a finite positive number.");
  if (!Number.isFinite(x.linearReductionFactor) || x.linearReductionFactor <= 0)
    simpleError("linearReductionFactor", "Provide a finite positive number.");
  if (!(x.linearReductionFactor <= 1))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const newDenominator = x.originalDenominator / x.linearReductionFactor;
  if (!Number.isFinite(newDenominator))
    simpleError(
      "newDenominator",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { newDenominator: Object.is(newDenominator, -0) ? 0 : newDenominator };
};

export const example = {
  input: {
    originalDenominator: 50000,
    linearReductionFactor: 0.5,
  },
  output: { newDenominator: 100000 },
} satisfies ToolExample<ReductionNewScaleInput, ReductionNewScaleOutput>;

export const tool = createSimpleTool({
  id: "cartography/reduction-new-scale",
  title: "Reduction New Scale",
  description:
    "New 1:N scale denominator after reducing a map by a linear factor in (0,1].",
  inputs: [
    {
      id: "originalDenominator",
      kind: "number",
      label: "Original Denominator",
      minimum: 0,
    },
    {
      id: "linearReductionFactor",
      kind: "number",
      label: "Linear Reduction Factor",
      minimum: 0,
    },
  ],
  outputs: [{ id: "newDenominator", kind: "number", label: "New Denominator" }],
  calculate: (input) =>
    calculateReductionNewScale({
      originalDenominator: input.originalDenominator as number,
      linearReductionFactor: input.linearReductionFactor as number,
    }),
});
export const reductionNewScaleTool = tool;
export const runReductionNewScale = tool.execute;
export default tool;
