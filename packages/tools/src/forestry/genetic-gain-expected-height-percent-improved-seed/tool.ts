import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly improvedSeedHeightsM: readonly number[];
  readonly matchedControlHeightsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedHeightContrastsM: readonly number[];
  readonly pooledHeightGainPercent: number;
  readonly meanPairedRelativeGainPercent: number;
}>;
const inputFields = [
  {
    id: "improvedSeedHeightsM",
    label: "Improved seed heights m",
    kind: "numberList",
  },
  {
    id: "matchedControlHeightsM",
    label: "Matched control heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedControlHeightsM.forEach((v) =>
    positive(v, "matchedControlHeightsM"),
  );
  input.improvedSeedHeightsM.forEach((v) =>
    nonnegative(v, "improvedSeedHeightsM"),
  );
  aligned(
    input.improvedSeedHeightsM,
    input.matchedControlHeightsM,
    "improvedSeedHeightsM",
  );
  return {
    pairedHeightContrastsM: input.improvedSeedHeightsM.map(
      (v, i) => v - input.matchedControlHeightsM[i],
    ),
    pooledHeightGainPercent:
      100 *
      (input.improvedSeedHeightsM.reduce((a, b) => a + b, 0) /
        input.matchedControlHeightsM.reduce((a, b) => a + b, 0) -
        1),
    meanPairedRelativeGainPercent:
      100 *
      mean(
        input.improvedSeedHeightsM.map(
          (v, i) => v / input.matchedControlHeightsM[i] - 1,
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  improvedSeedHeightsM: [3, 6],
  matchedControlHeightsM: [2, 4],
} satisfies Input;
export const exampleOutput = {
  pairedHeightContrastsM: [1, 2],
  pooledHeightGainPercent: 50,
  meanPairedRelativeGainPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/genetic-gain-expected-height-percent-improved-seed",
  title: "Improved Seed Genetic Gain Height Percent",
  description:
    "Compare matched improved/control height observations using pooled and paired relative gains; signed reductions remain and contrasts alone do not attribute causal genetic gain.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedHeightContrastsM",
      label: "Paired height contrasts m",
      kind: "numberList",
    },
    {
      id: "pooledHeightGainPercent",
      label: "Pooled height gain percent",
      kind: "number",
    },
    {
      id: "meanPairedRelativeGainPercent",
      label: "Mean paired relative gain percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      improvedSeedHeightsM: value.improvedSeedHeightsM as readonly number[],
      matchedControlHeightsM: value.matchedControlHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
