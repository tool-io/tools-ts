import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly alignedTaxonCountsFaunaA: readonly number[];
  readonly alignedTaxonCountsFaunaB: readonly number[];
}>;
export type Output = Readonly<{
  readonly rawAbundanceBrayCurtisDissimilarity: number;
  readonly relativeAbundanceBrayCurtisDissimilarity: number;
  readonly balancedAbundanceDifferenceComponent: number;
  readonly abundanceGradientComponent: number;
}>;
const inputFields = [
  {
    id: "alignedTaxonCountsFaunaA",
    label: "Aligned taxon counts fauna a",
    kind: "numberList",
  },
  {
    id: "alignedTaxonCountsFaunaB",
    label: "Aligned taxon counts fauna b",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.alignedTaxonCountsFaunaA.forEach((v) =>
    count(v, "alignedTaxonCountsFaunaA"),
  );
  input.alignedTaxonCountsFaunaB.forEach((v) =>
    count(v, "alignedTaxonCountsFaunaB"),
  );
  aligned(
    input.alignedTaxonCountsFaunaA,
    input.alignedTaxonCountsFaunaB,
    "alignedTaxonCountsFaunaA",
  );
  const na = positive(
      input.alignedTaxonCountsFaunaA.reduce((a, b) => a + b, 0),
      "faunaA",
    ),
    nb = positive(
      input.alignedTaxonCountsFaunaB.reduce((a, b) => a + b, 0),
      "faunaB",
    );
  let b = 0,
    c = 0,
    rawPositive = 0,
    rawNegative = 0;
  input.alignedTaxonCountsFaunaA.forEach((v, i) => {
    const d = v / na - input.alignedTaxonCountsFaunaB[i] / nb;
    b += Math.max(0, d);
    c += Math.max(0, -d);
    const raw = v - input.alignedTaxonCountsFaunaB[i];
    rawPositive += Math.max(0, raw);
    rawNegative += Math.max(0, -raw);
  });
  return {
    rawAbundanceBrayCurtisDissimilarity:
      (rawPositive + rawNegative) / (na + nb),
    relativeAbundanceBrayCurtisDissimilarity: (b + c) / 2,
    balancedAbundanceDifferenceComponent:
      (2 * Math.min(rawPositive, rawNegative)) / (na + nb),
    abundanceGradientComponent: Math.abs(rawPositive - rawNegative) / (na + nb),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  alignedTaxonCountsFaunaA: [1, 3, 0],
  alignedTaxonCountsFaunaB: [0, 2, 2],
} satisfies Input;
export const exampleOutput = {
  rawAbundanceBrayCurtisDissimilarity: 0.5,
  relativeAbundanceBrayCurtisDissimilarity: 0.5,
  balancedAbundanceDifferenceComponent: 0.5,
  abundanceGradientComponent: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/beta-turnover-faunas",
  title: "Beta Diversity Turnover Between Faunas",
  description:
    "Compare aligned abundance faunas using raw and equal-total relative Bray–Curtis. Raw-count difference is partitioned into 2*min(positive,negative) balanced change and absolute net gradient on the same total-count denominator; unlike Harrison incidence turnover, abundance rather than shared richness is used.",
  inputs: inputFields,
  outputs: [
    {
      id: "rawAbundanceBrayCurtisDissimilarity",
      label: "Raw abundance Bray Curtis dissimilarity",
      kind: "number",
    },
    {
      id: "relativeAbundanceBrayCurtisDissimilarity",
      label: "Relative abundance bray curtis dissimilarity",
      kind: "number",
    },
    {
      id: "balancedAbundanceDifferenceComponent",
      label: "Balanced abundance difference component",
      kind: "number",
    },
    {
      id: "abundanceGradientComponent",
      label: "Abundance gradient component",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      alignedTaxonCountsFaunaA:
        value.alignedTaxonCountsFaunaA as readonly number[],
      alignedTaxonCountsFaunaB:
        value.alignedTaxonCountsFaunaB as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
