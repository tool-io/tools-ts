import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  allocate,
} from "../shared.js";
export type Input = Readonly<{
  readonly parentAdultBeeCount: number;
  readonly parentBroodFrameCount: number;
  readonly parentFeedKg: number;
  readonly splitWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly adultBeeAllocations: readonly number[];
  readonly broodFrameAllocations: readonly number[];
  readonly feedAllocationsKg: readonly number[];
}>;
const inputFields = [
  {
    id: "parentAdultBeeCount",
    label: "Parent adult bee count",
    kind: "integer",
  },
  {
    id: "parentBroodFrameCount",
    label: "Parent brood frame count",
    kind: "integer",
  },
  { id: "parentFeedKg", label: "Parent feed kg", kind: "number" },
  { id: "splitWeights", label: "Split weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.parentFeedKg, "parentFeedKg");
  count(input.parentAdultBeeCount, "parentAdultBeeCount");
  count(input.parentBroodFrameCount, "parentBroodFrameCount");
  const adultBeeAllocations = allocate(
      input.parentAdultBeeCount,
      input.splitWeights,
    ),
    broodFrameAllocations = allocate(
      input.parentBroodFrameCount,
      input.splitWeights,
    ),
    sum = positive(
      input.splitWeights.reduce((a, b) => a + b, 0),
      "splitWeights",
    );
  return {
    adultBeeAllocations,
    broodFrameAllocations,
    feedAllocationsKg: input.splitWeights.map(
      (w) => (input.parentFeedKg * w) / sum,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  parentAdultBeeCount: 101,
  parentBroodFrameCount: 8,
  parentFeedKg: 9,
  splitWeights: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  adultBeeAllocations: [34, 34, 33],
  broodFrameAllocations: [3, 3, 2],
  feedAllocationsKg: [3, 3, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/split-ratio-colony-divider",
  title: "Split Ratio Colony Divider",
  description:
    "Apportion integer adults/brood frames by largest remainders and continuous feed by caller split weights; input order breaks integer ties, and biological adequacy is not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "adultBeeAllocations",
      label: "Adult bee allocations",
      kind: "numberList",
    },
    {
      id: "broodFrameAllocations",
      label: "Brood frame allocations",
      kind: "numberList",
    },
    {
      id: "feedAllocationsKg",
      label: "Feed allocations kg",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      parentAdultBeeCount: value.parentAdultBeeCount as number,
      parentBroodFrameCount: value.parentBroodFrameCount as number,
      parentFeedKg: value.parentFeedKg as number,
      splitWeights: value.splitWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
