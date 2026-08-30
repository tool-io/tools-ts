import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EnlargementNewScaleInput = Readonly<{
  readonly originalDenominator: number;
  readonly enlargementFactor: number;
}>;
export type EnlargementNewScaleOutput = Readonly<{
  readonly newDenominator: number;
}>;

export const calculateEnlargementNewScale = (
  x: EnlargementNewScaleInput,
): EnlargementNewScaleOutput => {
  if (!Number.isFinite(x.originalDenominator) || x.originalDenominator <= 0)
    simpleError("originalDenominator", "Provide a finite positive number.");
  if (!Number.isFinite(x.enlargementFactor) || x.enlargementFactor <= 0)
    simpleError("enlargementFactor", "Provide a finite positive number.");
  const newDenominator = x.originalDenominator / x.enlargementFactor;
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
    enlargementFactor: 2,
  },
  output: { newDenominator: 25000 },
} satisfies ToolExample<EnlargementNewScaleInput, EnlargementNewScaleOutput>;

export const tool = createSimpleTool({
  id: "cartography/enlargement-new-scale",
  title: "Enlargement New Scale",
  description:
    "New 1:N scale denominator after enlarging a map by a linear factor greater than zero.",
  inputs: [
    {
      id: "originalDenominator",
      kind: "number",
      label: "Original Denominator",
      minimum: 0,
    },
    {
      id: "enlargementFactor",
      kind: "number",
      label: "Enlargement Factor",
      minimum: 0,
    },
  ],
  outputs: [{ id: "newDenominator", kind: "number", label: "New Denominator" }],
  calculate: (input) =>
    calculateEnlargementNewScale({
      originalDenominator: input.originalDenominator as number,
      enlargementFactor: input.enlargementFactor as number,
    }),
});
export const enlargementNewScaleTool = tool;
export const runEnlargementNewScale = tool.execute;
export default tool;
