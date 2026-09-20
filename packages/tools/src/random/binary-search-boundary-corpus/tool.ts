import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  integerSchema,
  countSchema,
  ordered,
  safeInteger,
} from "../m500b-csv-algorithms-schemas.js";
import {
  sequenceCounts,
  sortedNumbers,
} from "../m500b-csv-algorithms-sequence.js";

export type BinarySearchBoundaryCorpusInput = {
  readonly length: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly targets: readonly number[];
  readonly seed?: number;
};
export type BinarySearchBoundaryCorpusOutput = {
  readonly values: readonly number[];
  readonly queries: readonly {
    readonly target: number;
    readonly lower: number;
    readonly upper: number;
    readonly count: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    length: countSchema(64, 1),
    minimumValue: integerSchema,
    maximumValue: integerSchema,
    targets: arraySchema(integerSchema, 16),
    seed: generatorSeedSchema,
  },
  ["length", "minimumValue", "maximumValue", "targets"],
);
export const outputSchema = objectSchema({
  values: arraySchema(integerSchema, 64),
  queries: arraySchema(
    objectSchema({
      target: integerSchema,
      lower: countSchema(64),
      upper: countSchema(64),
      count: countSchema(64),
    }),
    19,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is BinarySearchBoundaryCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateBinarySearchBoundaryCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BinarySearchBoundaryCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    ordered(input.minimumValue, input.maximumValue);
    const random = createGeneratorRandom(input.seed, context),
      values = sortedNumbers(
        Array.from({ length: input.length }, () =>
          random.integer(input.minimumValue, input.maximumValue),
        ),
      );
    const first = values[0],
      last = values[values.length - 1];
    if (first === undefined || last === undefined)
      throw new Error("Nonempty sorted array disappeared.");
    const below = safeInteger(BigInt(first) - 1n, "minimumValue"),
      above = safeInteger(BigInt(last) + 1n, "maximumValue");
    const targets = [random.pick(values), below, above, ...input.targets],
      counts = new Map(
        sequenceCounts(values.map(String)).map((entry) => [
          entry.key,
          entry.count,
        ]),
      );
    const bound = (target: number, upper: boolean): number => {
      let low = 0,
        high = values.length;
      while (low < high) {
        const middle = Math.floor((low + high) / 2),
          value = values[middle];
        if (value === undefined)
          throw new Error("Missing binary-search midpoint.");
        if (value < target || (upper && value === target)) low = middle + 1;
        else high = middle;
      }
      return low;
    };
    const queries = targets.map((rawTarget) => {
      const target = rawTarget || 0,
        lower = bound(target, false),
        upper = bound(target, true),
        count = upper - lower;
      if (count !== (counts.get(String(target)) ?? 0))
        throw new Error("Search boundaries disagree with frequency core.");
      return { target, lower, upper, count };
    });
    return toolSuccess({
      values,
      queries,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const binarySearchBoundaryCorpusExample = {
  input: {
    length: 4,
    minimumValue: 1,
    maximumValue: 3,
    targets: [3],
    seed: 42,
  },
  output: {
    values: [2, 2, 3, 3],
    queries: [
      { target: 2, lower: 0, upper: 2, count: 2 },
      { target: 1, lower: 0, upper: 0, count: 0 },
      { target: 4, lower: 4, upper: 4, count: 0 },
      { target: 3, lower: 2, upper: 4, count: 2 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BinarySearchBoundaryCorpusInput,
  BinarySearchBoundaryCorpusOutput
>;
export const binarySearchBoundaryCorpusTool = createModelDefinition<
  BinarySearchBoundaryCorpusInput,
  BinarySearchBoundaryCorpusOutput
>({
  id: "random/binary-search-boundary-corpus",
  title: "Random Binary Search Boundary Corpus Generator",
  description:
    "Generate a sorted integer array with a present query, absent endpoint controls and caller targets, retaining exact binary lower/upper indices cross-checked against frequency counts.",
  inputSchema,
  outputSchema,
  execute: calculateBinarySearchBoundaryCorpus,
});
export const runBinarySearchBoundaryCorpus =
  binarySearchBoundaryCorpusTool.execute;
export default binarySearchBoundaryCorpusTool;
