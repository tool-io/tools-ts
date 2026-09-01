import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly pairedProtectedHarvestMassKg: readonly number[];
  readonly pairedExposedHarvestMassKg: readonly number[];
  readonly pairedMatchedRepresentedVineCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedProtectedMinusExposedMassKg: readonly number[];
  readonly pooledMatchedApparentLossFraction: number;
  readonly signedApparentLossKgPerRepresentedVine: number;
}>;
const inputFields = [
  {
    id: "pairedProtectedHarvestMassKg",
    label: "Paired protected harvest mass kg",
    kind: "numberList",
  },
  {
    id: "pairedExposedHarvestMassKg",
    label: "Paired exposed harvest mass kg",
    kind: "numberList",
  },
  {
    id: "pairedMatchedRepresentedVineCounts",
    label: "Paired matched represented vine counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pairedProtectedHarvestMassKg.forEach((v) =>
    positive(v, "pairedProtectedHarvestMassKg"),
  );
  input.pairedExposedHarvestMassKg.forEach((v) =>
    nonnegative(v, "pairedExposedHarvestMassKg"),
  );
  aligned(
    input.pairedProtectedHarvestMassKg,
    input.pairedExposedHarvestMassKg,
    "pairedProtectedHarvestMassKg",
  );
  aligned(
    input.pairedProtectedHarvestMassKg,
    input.pairedMatchedRepresentedVineCounts,
    "pairedProtectedHarvestMassKg",
  );
  input.pairedMatchedRepresentedVineCounts.forEach((v) =>
    bounded(v, "vines", 1, 1000000),
  );
  const loss = input.pairedProtectedHarvestMassKg.map(
      (v, i) => v - input.pairedExposedHarvestMassKg[i],
    ),
    total = sum(loss);
  return {
    signedProtectedMinusExposedMassKg: loss,
    pooledMatchedApparentLossFraction:
      total / sum(input.pairedProtectedHarvestMassKg),
    signedApparentLossKgPerRepresentedVine:
      total / sum(input.pairedMatchedRepresentedVineCounts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pairedProtectedHarvestMassKg: [10, 20],
  pairedExposedHarvestMassKg: [8, 12],
  pairedMatchedRepresentedVineCounts: [2, 4],
} satisfies Input;
export const exampleOutput = {
  signedProtectedMinusExposedMassKg: [2, 8],
  pooledMatchedApparentLossFraction: 0.3333333333333333,
  signedApparentLossKgPerRepresentedVine: 1.6666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/bird-damage-loss-percent-estimate",
  title: "Bird Damage Loss Percent Estimate Calculator",
  description:
    "Compare actual matched protected/exposed vine harvest masses as apparent bird-loss proxy with independent vine exposure; signed exposed gains retained, protection confounds prevent causal bird damage diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedProtectedMinusExposedMassKg",
      label: "Signed protected minus exposed mass kg",
      kind: "numberList",
    },
    {
      id: "pooledMatchedApparentLossFraction",
      label: "Pooled matched apparent loss fraction",
      kind: "number",
    },
    {
      id: "signedApparentLossKgPerRepresentedVine",
      label: "Signed apparent loss kg per represented vine",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pairedProtectedHarvestMassKg:
        value.pairedProtectedHarvestMassKg as readonly number[],
      pairedExposedHarvestMassKg:
        value.pairedExposedHarvestMassKg as readonly number[],
      pairedMatchedRepresentedVineCounts:
        value.pairedMatchedRepresentedVineCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
