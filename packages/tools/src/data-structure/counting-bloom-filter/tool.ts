import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CountingBloomFilterResult = {
  readonly counterCount: number;
  readonly estimatedQueryMultiplicity: number;
  readonly hashCount: number;
  readonly itemInsertions: number;
  readonly nonzeroCounters: number;
  readonly possiblyPresent: boolean;
  readonly query: string;
  readonly successfulRemovals: number;
};

const hash = (value: string, seed: number): number => {
  let state = (2166136261 ^ seed) >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    state ^= value.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
};

export const calculateCountingBloomFilter = (
  items: readonly string[],
  removedItems: readonly string[],
  query: string,
  counterCount: number,
  hashCount: number,
): CountingBloomFilterResult => {
  if (
    !Number.isSafeInteger(counterCount) ||
    counterCount < 8 ||
    counterCount > 1_000_000
  )
    simpleError(
      "counterCount",
      "Counter count must be a whole number from 8 to 1,000,000.",
    );
  if (!Number.isSafeInteger(hashCount) || hashCount < 1 || hashCount > 32)
    simpleError("hashCount", "Hash count must be a whole number from 1 to 32.");
  const counters = new Uint32Array(counterCount);
  const indexes = (value: string) =>
    Array.from(
      { length: hashCount },
      (_, index) => hash(value, index + 1) % counterCount,
    );
  for (const item of items)
    for (const index of indexes(item)) counters[index] += 1;
  let successfulRemovals = 0;
  for (const item of removedItems) {
    const itemIndexes = indexes(item);
    const required = new Map<number, number>();
    for (const index of itemIndexes)
      required.set(index, (required.get(index) ?? 0) + 1);
    if ([...required].every(([index, count]) => counters[index]! >= count)) {
      for (const index of itemIndexes) counters[index] -= 1;
      successfulRemovals += 1;
    }
  }
  const queryIndexes = indexes(query);
  return {
    counterCount,
    estimatedQueryMultiplicity: Math.min(
      ...queryIndexes.map((index) => counters[index]!),
    ),
    hashCount,
    itemInsertions: items.length,
    nonzeroCounters: counters.reduce(
      (total, counter) => total + Number(counter > 0),
      0,
    ),
    possiblyPresent: queryIndexes.every((index) => counters[index]! > 0),
    query,
    successfulRemovals,
  };
};

const exampleInput = {
  counterCount: 128,
  hashCount: 3,
  items: ["apple", "banana", "banana", "pear"],
  query: "banana",
  removedItems: ["banana"],
} as const;
export const countingBloomFilterExample = {
  input: exampleInput,
  output: {
    result: calculateCountingBloomFilter(
      exampleInput.items,
      exampleInput.removedItems,
      exampleInput.query,
      exampleInput.counterCount,
      exampleInput.hashCount,
    ),
  },
} satisfies ToolExample<
  {
    readonly counterCount: number;
    readonly hashCount: number;
    readonly items: readonly string[];
    readonly query: string;
    readonly removedItems: readonly string[];
  },
  { readonly result: CountingBloomFilterResult }
>;

export const countingBloomFilterTool = createSimpleTool({
  calculate: (input) => ({
    result: calculateCountingBloomFilter(
      input.items as string[],
      input.removedItems as string[],
      input.query as string,
      input.counterCount as number,
      input.hashCount as number,
    ),
  }),
  description:
    "Build a deterministic counting Bloom filter, apply requested removals, and test a query. Positive membership and multiplicity remain probabilistic because hash collisions can overestimate both.",
  id: "data-structure/counting-bloom-filter",
  inputs: [
    { id: "items", kind: "stringList", label: "Inserted items" },
    { id: "removedItems", kind: "stringList", label: "Items to remove" },
    { id: "query", kind: "string", label: "Query" },
    {
      id: "counterCount",
      kind: "integer",
      label: "Counters",
      maximum: 1_000_000,
      minimum: 8,
    },
    {
      id: "hashCount",
      kind: "integer",
      label: "Hash functions",
      maximum: 32,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "counting-bloom-filter/result",
      id: "result",
      kind: "object",
      label: "Counting Bloom filter result",
    },
  ],
  title: "Counting Bloom Filter Calculator",
});
export const runCountingBloomFilter = countingBloomFilterTool.execute;
export default countingBloomFilterTool;
