import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { continuedFraction } from "../milestone-algorithms.js";

export const example = {
  input: {
    numerator: 415,
    denominator: 93,
  },
  output: {
    coefficients: [4, 2, 6, 7],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tool = createSimpleTool({
  id: "number/continued-fraction",
  title: "Continued Fraction Expander",
  description:
    "Find the finite simple continued-fraction coefficients of a rational number by Euclidean division, including correct floor behavior for negative numerators.",
  inputs: [
    { id: "numerator", kind: "integer", label: "numerator" },
    { id: "denominator", kind: "integer", label: "denominator" },
  ],
  outputs: [{ id: "coefficients", kind: "numberList", label: "coefficients" }],
  calculate: (input) => ({
    coefficients: continuedFraction(
      input.numerator as number,
      input.denominator as number,
    ),
  }),
});
export type ContinuedFractionInput = Readonly<typeof example.input>;
export type ContinuedFractionOutput = Readonly<typeof example.output>;
export const continuedFractionTool = tool;
export const runContinuedFraction = tool.execute;
export default tool;
