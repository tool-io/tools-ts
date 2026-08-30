import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly matchedVineFruitYieldKg: readonly number[];
  readonly matchedVineDormantPruningKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly perVineRavazIndices: readonly number[];
  readonly pooledRavazIndex: number;
}>;
const inputFields = [
  {
    id: "matchedVineFruitYieldKg",
    label: "Matched vine fruit yield kg",
    kind: "numberList",
  },
  {
    id: "matchedVineDormantPruningKg",
    label: "Matched vine dormant pruning kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedVineDormantPruningKg.forEach((v) =>
    positive(v, "matchedVineDormantPruningKg"),
  );
  input.matchedVineFruitYieldKg.forEach((v) =>
    nonnegative(v, "matchedVineFruitYieldKg"),
  );
  aligned(
    input.matchedVineFruitYieldKg,
    input.matchedVineDormantPruningKg,
    "matchedVineFruitYieldKg",
  );
  return {
    perVineRavazIndices: input.matchedVineFruitYieldKg.map(
      (v, i) => v / input.matchedVineDormantPruningKg[i],
    ),
    pooledRavazIndex:
      input.matchedVineFruitYieldKg.reduce((a, b) => a + b, 0) /
      input.matchedVineDormantPruningKg.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matchedVineFruitYieldKg: [10, 15],
  matchedVineDormantPruningKg: [1, 3],
} satisfies Input;
export const exampleOutput = {
  perVineRavazIndices: [10, 5],
  pooledRavazIndex: 6.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/ravaz-index-yield-pruning-ratio",
  title: "Ravaz Index Yield Pruning Ratio",
  description:
    "Compute matched fruit-yield/dormant-pruning Ravaz ratios and pooled biomass-exposure ratio, not an unweighted ratio mean or a prescribed balanced-vine range.",
  inputs: inputFields,
  outputs: [
    {
      id: "perVineRavazIndices",
      label: "Per vine ravaz indices",
      kind: "numberList",
    },
    { id: "pooledRavazIndex", label: "Pooled ravaz index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      matchedVineFruitYieldKg:
        value.matchedVineFruitYieldKg as readonly number[],
      matchedVineDormantPruningKg:
        value.matchedVineDormantPruningKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
