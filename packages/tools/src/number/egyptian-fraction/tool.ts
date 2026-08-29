import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { egyptianFraction } from "../milestone-algorithms.js";

export const example = {
  input: {
    numerator: 4,
    denominator: 13,
  },
  output: {
    terms: ["1/4", "1/18", "1/468"],
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tool = createSimpleTool({
  id: "number/egyptian-fraction",
  title: "Egyptian Fraction Expander",
  description:
    "Expand a positive rational number into an integer part and distinct unit fractions using the greedy algorithm; output may have large denominators.",
  inputs: [
    { id: "numerator", kind: "integer", label: "numerator", minimum: 1 },
    { id: "denominator", kind: "integer", label: "denominator", minimum: 1 },
  ],
  outputs: [{ id: "terms", kind: "stringList", label: "terms" }],
  calculate: (input) => ({
    terms: egyptianFraction(
      input.numerator as number,
      input.denominator as number,
    ),
  }),
});
export type EgyptianFractionInput = Readonly<typeof example.input>;
export type EgyptianFractionOutput = Readonly<typeof example.output>;
export const egyptianFractionTool = tool;
export const runEgyptianFraction = tool.execute;
export default tool;
