import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly harvestedCellCounts: readonly number[];
  readonly netHarvestMassesMg: readonly number[];
}>;
export type Output = Readonly<{
  readonly batchJellyMgPerCell: readonly number[];
  readonly pooledJellyMgPerCell: number;
  readonly totalJellyMg: number;
}>;
const inputFields = [
  {
    id: "harvestedCellCounts",
    label: "Harvested cell counts",
    kind: "numberList",
  },
  {
    id: "netHarvestMassesMg",
    label: "Net harvest masses mg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.harvestedCellCounts.forEach((v) => positive(v, "harvestedCellCounts"));
  input.netHarvestMassesMg.forEach((v) => nonnegative(v, "netHarvestMassesMg"));
  input.harvestedCellCounts.forEach((v) => count(v, "harvestedCellCounts"));
  aligned(
    input.harvestedCellCounts,
    input.netHarvestMassesMg,
    "harvestedCellCounts",
  );
  const totalJellyMg = input.netHarvestMassesMg.reduce((a, b) => a + b, 0);
  return {
    batchJellyMgPerCell: input.netHarvestMassesMg.map(
      (v, i) => v / input.harvestedCellCounts[i],
    ),
    pooledJellyMgPerCell:
      totalJellyMg / input.harvestedCellCounts.reduce((a, b) => a + b, 0),
    totalJellyMg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  harvestedCellCounts: [10, 20],
  netHarvestMassesMg: [200, 600],
} satisfies Input;
export const exampleOutput = {
  batchJellyMgPerCell: [20, 30],
  pooledJellyMgPerCell: 26.666666666666668,
  totalJellyMg: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/royal-jelly-per-cell-mg-harvest",
  title: "Royal Jelly Per Cell MG Harvest",
  description:
    "Calculate batch and pooled royal-jelly net mass per harvested cell, weighting the pooled result by actual cells rather than averaging batch means.",
  inputs: inputFields,
  outputs: [
    {
      id: "batchJellyMgPerCell",
      label: "Batch jelly mg per cell",
      kind: "numberList",
    },
    {
      id: "pooledJellyMgPerCell",
      label: "Pooled jelly mg per cell",
      kind: "number",
    },
    { id: "totalJellyMg", label: "Total jelly mg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      harvestedCellCounts: value.harvestedCellCounts as readonly number[],
      netHarvestMassesMg: value.netHarvestMassesMg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
