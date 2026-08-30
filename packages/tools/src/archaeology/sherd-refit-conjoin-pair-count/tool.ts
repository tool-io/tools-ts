import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, maximum, ids } from "../shared.js";
export type Input = Readonly<{
  readonly sherdIds: readonly number[];
  readonly observedConjoinPairs: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly uniqueConjoinPairCount: number;
  readonly duplicatePairRecordCount: number;
  readonly refitGroupCount: number;
  readonly largestRefitGroupSherdCount: number;
  readonly isolatedSherdCount: number;
}>;
const inputFields = [
  { id: "sherdIds", label: "Sherd ids", kind: "numberList" },
  {
    id: "observedConjoinPairs",
    label: "Observed conjoin pairs",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ids(input.sherdIds, "sherdIds");
  const parent = input.sherdIds.map((_, i) => i),
    index = new Map(input.sherdIds.map((v, i) => [v, i])),
    seen = new Set<string>();
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  for (const e of input.observedConjoinPairs) {
    if (e.length !== 2 || e[0] === e[1] || !index.has(e[0]) || !index.has(e[1]))
      simpleError(
        "observedConjoinPairs",
        "Two distinct known sherd IDs per observed pair required.",
      );
    const a = index.get(e[0])!,
      b = index.get(e[1])!;
    seen.add([Math.min(a, b), Math.max(a, b)].join(":"));
    parent[find(a)] = find(b);
  }
  const sizes = new Map<number, number>();
  parent.forEach((_, i) => {
    const r = find(i);
    sizes.set(r, (sizes.get(r) ?? 0) + 1);
  });
  return {
    uniqueConjoinPairCount: seen.size,
    duplicatePairRecordCount: input.observedConjoinPairs.length - seen.size,
    refitGroupCount: sizes.size,
    largestRefitGroupSherdCount: maximum([...sizes.values()]),
    isolatedSherdCount: [...sizes.values()].filter((v) => v === 1).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sherdIds: [1, 2, 3, 4],
  observedConjoinPairs: [
    [1, 2],
    [2, 1],
    [2, 3],
  ],
} satisfies Input;
export const exampleOutput = {
  uniqueConjoinPairCount: 2,
  duplicatePairRecordCount: 1,
  refitGroupCount: 2,
  largestRefitGroupSherdCount: 3,
  isolatedSherdCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/sherd-refit-conjoin-pair-count",
  title: "Sherd Refit Conjoin Pair Count Tool",
  description:
    "Deduplicate undirected observed sherd conjoins and summarize connected refit groups including isolates; linked groups do not establish complete vessel count, and no unseen joins are invented.",
  inputs: inputFields,
  outputs: [
    {
      id: "uniqueConjoinPairCount",
      label: "Unique conjoin pair count",
      kind: "number",
    },
    {
      id: "duplicatePairRecordCount",
      label: "Duplicate pair record count",
      kind: "number",
    },
    { id: "refitGroupCount", label: "Refit group count", kind: "number" },
    {
      id: "largestRefitGroupSherdCount",
      label: "Largest refit group sherd count",
      kind: "number",
    },
    { id: "isolatedSherdCount", label: "Isolated sherd count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sherdIds: value.sherdIds as readonly number[],
      observedConjoinPairs:
        value.observedConjoinPairs as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
