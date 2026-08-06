import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BloomFilterResult = {
  readonly bitCount: number;
  readonly falsePositiveProbability: number;
  readonly hashCount: number;
  readonly itemCount: number;
  readonly possiblyPresent: boolean;
  readonly query: string;
  readonly setBits: number;
};

const hash = (value: string, seed: number): number => {
  let state = (2166136261 ^ seed) >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    state ^= value.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
};

export const calculateBloomFilter = (
  rawItems: readonly string[],
  query: string,
  bitCount: number,
  hashCount: number,
): BloomFilterResult => {
  const items = [...new Set(rawItems)];
  const bits = new Uint8Array(bitCount);
  const indexes = (value: string): number[] =>
    Array.from(
      { length: hashCount },
      (_, index) => hash(value, index + 1) % bitCount,
    );
  for (const item of items) for (const index of indexes(item)) bits[index] = 1;
  return {
    bitCount,
    falsePositiveProbability: Number(
      (
        (1 - Math.exp((-hashCount * items.length) / bitCount)) **
        hashCount
      ).toPrecision(8),
    ),
    hashCount,
    itemCount: items.length,
    possiblyPresent: indexes(query).every((index) => bits[index] === 1),
    query,
    setBits: bits.reduce((sum, bit) => sum + bit, 0),
  };
};

export const bloomFilterExample = {
  input: {
    bitCount: 128,
    hashCount: 3,
    items: ["apple", "banana", "pear"],
    query: "banana",
  },
  output: {
    result: {
      bitCount: 128,
        falsePositiveProbability: 0.00031301237,
      hashCount: 3,
      itemCount: 3,
      possiblyPresent: true,
      query: "banana",
      setBits: 9,
    },
  },
} satisfies ToolExample<
  {
    readonly bitCount: number;
    readonly hashCount: number;
    readonly items: readonly string[];
    readonly query: string;
  },
  { readonly result: BloomFilterResult }
>;

export const bloomFilterTool = createSimpleTool({
  id: "data-structure/bloom-filter",
  title: "Bloom Filter Calculator",
  description:
    "Build a deterministic Bloom filter, test an item, and estimate its false-positive probability.",
  inputs: [
    { format: "set/string", id: "items", kind: "stringList", label: "Items" },
    { id: "query", kind: "string", label: "Query" },
    {
      id: "bitCount",
      kind: "integer",
      label: "Bits",
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
      format: "bloom-filter/result",
      id: "result",
      kind: "object",
      label: "Bloom filter result",
    },
  ],
  calculate: (input) => ({
    result: calculateBloomFilter(
      input.items as string[],
      input.query as string,
      input.bitCount as number,
      input.hashCount as number,
    ),
  }),
});

export const runBloomFilter = bloomFilterTool.execute;
export default bloomFilterTool;
