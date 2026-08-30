import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly positiveTaxonAbundances: readonly number[];
}>;
export type Output = Readonly<{
  readonly singletonTaxonCount: number;
  readonly totalIndividuals: number;
  readonly goodsSampleCoverage: number;
}>;
const inputFields = [
  {
    id: "positiveTaxonAbundances",
    label: "Positive taxon abundances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.positiveTaxonAbundances.forEach((v) =>
    positive(v, "positiveTaxonAbundances"),
  );
  input.positiveTaxonAbundances.forEach((v) =>
    count(v, "positiveTaxonAbundances"),
  );
  const totalIndividuals = input.positiveTaxonAbundances.reduce(
      (a, b) => a + b,
      0,
    ),
    singletonTaxonCount = input.positiveTaxonAbundances.filter(
      (v) => v === 1,
    ).length;
  positive(totalIndividuals, "positiveTaxonAbundances");
  return {
    singletonTaxonCount,
    totalIndividuals,
    goodsSampleCoverage: 1 - singletonTaxonCount / totalIndividuals,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positiveTaxonAbundances: [1, 2, 3, 1],
} satisfies Input;
export const exampleOutput = {
  singletonTaxonCount: 2,
  totalIndividuals: 7,
  goodsSampleCoverage: 0.7142857142857143,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/goods-u-coverage",
  title: "Good's U Sample Coverage",
  description:
    "Compute Good’s U=1-f1/N on positive observed abundance counts; coverage estimates sampled individual probability mass, not species completeness or a guarantee that rare taxa were found.",
  inputs: inputFields,
  outputs: [
    {
      id: "singletonTaxonCount",
      label: "Singleton taxon count",
      kind: "number",
    },
    { id: "totalIndividuals", label: "Total individuals", kind: "number" },
    {
      id: "goodsSampleCoverage",
      label: "Goods sample coverage",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      positiveTaxonAbundances:
        value.positiveTaxonAbundances as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
