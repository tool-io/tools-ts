import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly isotopologueCounts: readonly number[];
  readonly carbonSites: number;
}>;
export type Output = Readonly<{
  readonly fractions: readonly number[];
  readonly meanLabeledCarbons: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.carbonSites < 0 ||
    !Number.isSafeInteger(input.carbonSites) ||
    input.isotopologueCounts.length !== input.carbonSites + 1 ||
    input.isotopologueCounts.some((v) => v < 0)
  )
    simpleError(
      "isotopologueCounts",
      "M+0 through M+n counts must match carbon sites.",
    );
  const total = input.isotopologueCounts.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError("isotopologueCounts", "Total abundance must be positive.");
  const fractions = input.isotopologueCounts.map((v) => v / total);
  return {
    fractions,
    meanLabeledCarbons: fractions.reduce((s, v, i) => s + v * i, 0),
  };
};
export const exampleInput = {
  isotopologueCounts: [20, 30, 50],
  carbonSites: 2,
} satisfies Input;
export const exampleOutput = {
  fractions: [0.2, 0.3, 0.5],
  meanLabeledCarbons: 1.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/isotopologue-distribution",
  title: "Isotopologue Distribution",
  description:
    "Normalize M+0 through M+n isotopologues and count mean labeled carbons.",
  inputs: [
    {
      id: "isotopologueCounts",
      kind: "numberList",
      label: "Isotopologue counts",
    },
    { id: "carbonSites", kind: "number", label: "Carbon sites" },
  ],
  outputs: [
    { id: "fractions", kind: "numberList", label: "Fractions" },
    { id: "meanLabeledCarbons", kind: "number", label: "Mean labeled carbons" },
  ],
  calculate: (value) =>
    calculate({
      isotopologueCounts: value.isotopologueCounts as readonly number[],
      carbonSites: value.carbonSites as number,
    }),
});
export const run = tool.execute;
export default tool;
