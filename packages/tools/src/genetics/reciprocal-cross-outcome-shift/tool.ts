import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count, positive, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly phenotypeLabels: readonly string[];
  readonly firstCrossCounts: readonly number[];
  readonly reciprocalCrossCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstPercentages: readonly number[];
  readonly reciprocalPercentages: readonly number[];
  readonly differencePoints: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.phenotypeLabels, input.firstCrossCounts, "phenotypeLabels");
  aligned(
    input.phenotypeLabels,
    input.reciprocalCrossCounts,
    "phenotypeLabels",
  );
  input.firstCrossCounts.forEach((v) => count(v, "firstCrossCounts"));
  input.reciprocalCrossCounts.forEach((v) => count(v, "reciprocalCrossCounts"));
  const a = input.firstCrossCounts.reduce((x, y) => x + y, 0),
    b = input.reciprocalCrossCounts.reduce((x, y) => x + y, 0);
  positive(a, "firstCrossCounts");
  positive(b, "reciprocalCrossCounts");
  const firstPercentages = input.firstCrossCounts.map((v) => (100 * v) / a),
    reciprocalPercentages = input.reciprocalCrossCounts.map(
      (v) => (100 * v) / b,
    );
  return {
    firstPercentages,
    reciprocalPercentages,
    differencePoints: firstPercentages.map(
      (v, i) => reciprocalPercentages[i] - v,
    ),
  };
};
export const exampleInput = {
  phenotypeLabels: ["affected", "unaffected"],
  firstCrossCounts: [20, 80],
  reciprocalCrossCounts: [40, 60],
} satisfies Input;
export const exampleOutput = {
  firstPercentages: [20, 80],
  reciprocalPercentages: [40, 60],
  differencePoints: [20, -20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/reciprocal-cross-outcome-shift",
  title: "Reciprocal Cross Outcome Shift",
  description:
    "Compare reciprocal-cross phenotype distributions without asserting sex linkage from a difference alone.",
  inputs: [
    { id: "phenotypeLabels", label: "Phenotype labels", kind: "stringList" },
    { id: "firstCrossCounts", label: "First cross counts", kind: "numberList" },
    {
      id: "reciprocalCrossCounts",
      label: "Reciprocal cross counts",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "firstPercentages", label: "First percentages", kind: "numberList" },
    {
      id: "reciprocalPercentages",
      label: "Reciprocal percentages",
      kind: "numberList",
    },
    { id: "differencePoints", label: "Difference points", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      phenotypeLabels: value.phenotypeLabels as readonly string[],
      firstCrossCounts: value.firstCrossCounts as readonly number[],
      reciprocalCrossCounts: value.reciprocalCrossCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
