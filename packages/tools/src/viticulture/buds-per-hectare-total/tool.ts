import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly representedVineCountsByBlock: readonly number[];
  readonly retainedFruitBudsPerVineByBlock: readonly number[];
  readonly blockAreasHa: readonly number[];
  readonly callerBudBurstFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly blockRetainedFruitBudsPerHa: readonly number[];
  readonly totalRetainedFruitBuds: number;
  readonly expectedBurstShootsPerHaByBlock: readonly number[];
}>;
const inputFields = [
  {
    id: "representedVineCountsByBlock",
    label: "Represented vine counts by block",
    kind: "numberList",
  },
  {
    id: "retainedFruitBudsPerVineByBlock",
    label: "Retained fruit buds per vine by block",
    kind: "numberList",
  },
  { id: "blockAreasHa", label: "Block areas ha", kind: "numberList" },
  {
    id: "callerBudBurstFractions",
    label: "Caller bud burst fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.blockAreasHa.forEach((v) => positive(v, "blockAreasHa"));
  input.callerBudBurstFractions.forEach((v) =>
    fraction(v, "callerBudBurstFractions"),
  );
  input.representedVineCountsByBlock.forEach((v) =>
    count(v, "representedVineCountsByBlock"),
  );
  input.retainedFruitBudsPerVineByBlock.forEach((v) =>
    count(v, "retainedFruitBudsPerVineByBlock"),
  );
  aligned(
    input.representedVineCountsByBlock,
    input.retainedFruitBudsPerVineByBlock,
    "representedVineCountsByBlock",
  );
  aligned(
    input.representedVineCountsByBlock,
    input.blockAreasHa,
    "representedVineCountsByBlock",
  );
  aligned(
    input.representedVineCountsByBlock,
    input.callerBudBurstFractions,
    "representedVineCountsByBlock",
  );
  const n = input.representedVineCountsByBlock.map(
      (v, i) => v * input.retainedFruitBudsPerVineByBlock[i],
    ),
    totalRetainedFruitBuds = n.reduce((a, b) => a + b, 0);
  count(totalRetainedFruitBuds, "totalBuds");
  return {
    blockRetainedFruitBudsPerHa: n.map((v, i) => v / input.blockAreasHa[i]),
    totalRetainedFruitBuds,
    expectedBurstShootsPerHaByBlock: n.map(
      (v, i) => (v * input.callerBudBurstFractions[i]) / input.blockAreasHa[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  representedVineCountsByBlock: [100, 200],
  retainedFruitBudsPerVineByBlock: [10, 20],
  blockAreasHa: [1, 2],
  callerBudBurstFractions: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  blockRetainedFruitBudsPerHa: [1000, 2000],
  totalRetainedFruitBuds: 5000,
  expectedBurstShootsPerHaByBlock: [500, 2000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/buds-per-hectare-total",
  title: "Buds Per Hectare Total",
  description:
    "Expand measured retained fruit-bud loading through actual block vine inventories/areas and caller bud-burst fractions; distinguishes per-vine Guyot ledger from per-area expected shoots, not a density ideal.",
  inputs: inputFields,
  outputs: [
    {
      id: "blockRetainedFruitBudsPerHa",
      label: "Block retained fruit buds per ha",
      kind: "numberList",
    },
    {
      id: "totalRetainedFruitBuds",
      label: "Total retained fruit buds",
      kind: "number",
    },
    {
      id: "expectedBurstShootsPerHaByBlock",
      label: "Expected burst shoots per ha by block",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      representedVineCountsByBlock:
        value.representedVineCountsByBlock as readonly number[],
      retainedFruitBudsPerVineByBlock:
        value.retainedFruitBudsPerVineByBlock as readonly number[],
      blockAreasHa: value.blockAreasHa as readonly number[],
      callerBudBurstFractions:
        value.callerBudBurstFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
