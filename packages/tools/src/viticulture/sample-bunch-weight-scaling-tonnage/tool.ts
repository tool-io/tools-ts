import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleBunchMassesKgByStratum: readonly (readonly number[])[];
  readonly representedHarvestBunchCounts: readonly number[];
  readonly sampleInclusionProbabilities: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly inverseProbabilityMeanBunchMassesKg: readonly number[];
  readonly stratumScaledYieldTonnes: readonly number[];
  readonly totalStratifiedYieldTonnes: number;
}>;
const inputFields = [
  {
    id: "sampleBunchMassesKgByStratum",
    label: "Sample bunch masses kg by stratum",
    kind: "matrix",
  },
  {
    id: "representedHarvestBunchCounts",
    label: "Represented harvest bunch counts",
    kind: "numberList",
  },
  {
    id: "sampleInclusionProbabilities",
    label: "Sample inclusion probabilities",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedHarvestBunchCounts.forEach((v) =>
    count(v, "representedHarvestBunchCounts"),
  );
  shape(input.sampleBunchMassesKgByStratum, "masses");
  shape(input.sampleInclusionProbabilities, "inclusion");
  aligned(
    input.sampleBunchMassesKgByStratum,
    input.representedHarvestBunchCounts,
    "strata",
  );
  aligned(
    input.sampleBunchMassesKgByStratum,
    input.sampleInclusionProbabilities,
    "strata",
  );
  const means = input.sampleBunchMassesKgByStratum.map((row, i) => {
      aligned(row, input.sampleInclusionProbabilities[i], "samples");
      let w = 0,
        m = 0;
      row.forEach((v, j) => {
        nonnegative(v, "bunchMass");
        const p = positive(
          fraction(
            input.sampleInclusionProbabilities[i][j],
            "inclusionProbability",
          ),
          "inclusionProbability",
        );
        w += 1 / p;
        m += v / p;
      });
      return m / w;
    }),
    y = means.map(
      (v, i) => (v * input.representedHarvestBunchCounts[i]) / 1000,
    );
  return {
    inverseProbabilityMeanBunchMassesKg: means,
    stratumScaledYieldTonnes: y,
    totalStratifiedYieldTonnes: y.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleBunchMassesKgByStratum: [
    [1, 3],
    [2, 2],
  ],
  representedHarvestBunchCounts: [100, 200],
  sampleInclusionProbabilities: [
    [0.5, 1],
    [1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  inverseProbabilityMeanBunchMassesKg: [1.6666666666666667, 2],
  stratumScaledYieldTonnes: [0.16666666666666666, 0.4],
  totalStratifiedYieldTonnes: 0.5666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/sample-bunch-weight-scaling-tonnage",
  title: "Sample Bunch Weight Scaling Tonnage",
  description:
    "Scale stratified measured bunch mass using caller known sample inclusion probabilities and actual represented bunch counts, explicitly Hájek weighted mean; not equal-weight count method, exact unbiased population total or random-sample claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "inverseProbabilityMeanBunchMassesKg",
      label: "Inverse probability mean bunch masses kg",
      kind: "numberList",
    },
    {
      id: "stratumScaledYieldTonnes",
      label: "Stratum scaled yield tonnes",
      kind: "numberList",
    },
    {
      id: "totalStratifiedYieldTonnes",
      label: "Total stratified yield tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleBunchMassesKgByStratum:
        value.sampleBunchMassesKgByStratum as readonly (readonly number[])[],
      representedHarvestBunchCounts:
        value.representedHarvestBunchCounts as readonly number[],
      sampleInclusionProbabilities:
        value.sampleInclusionProbabilities as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
