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
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  generatorSampleIndices,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  integerSchema,
  countSchema,
} from "../m500b-csv-algorithms-schemas.js";
import { sequenceCounts } from "../m500b-csv-algorithms-sequence.js";

export type HashTableCollisionWorkloadInput = {
  readonly bucketCount: number;
  readonly targetBucket: number;
  readonly multiplier: number;
  readonly offset: number;
  readonly collidingCount: number;
  readonly noiseCount: number;
  readonly seed?: number;
};
export type HashTableCollisionWorkloadOutput = {
  readonly keys: readonly number[];
  readonly buckets: readonly number[];
  readonly plantedCollisionCount: number;
  readonly bucketCounts: readonly number[];
  readonly collisionPairs: readonly (readonly number[])[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    bucketCount: countSchema(32, 1),
    targetBucket: countSchema(31),
    multiplier: countSchema(32, 1),
    offset: integerSchema,
    collidingCount: countSchema(32, 1),
    noiseCount: countSchema(32),
    seed: generatorSeedSchema,
  },
  [
    "bucketCount",
    "targetBucket",
    "multiplier",
    "offset",
    "collidingCount",
    "noiseCount",
  ],
);
export const outputSchema = objectSchema({
  keys: arraySchema(countSchema(32031), 64),
  buckets: arraySchema(countSchema(31), 64),
  plantedCollisionCount: countSchema(32, 1),
  bucketCounts: arraySchema(countSchema(64), 32),
  collisionPairs: arraySchema(arraySchema(countSchema(63), 2, 2), 2016),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HashTableCollisionWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateHashTableCollisionWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HashTableCollisionWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.targetBucket >= input.bucketCount)
      return simpleError(
        "targetBucket",
        "Target bucket must lie inside the table.",
        "bucket_range",
      );
    const modulus = BigInt(input.bucketCount),
      hash = (key: number): number =>
        Number(
          (((BigInt(input.multiplier) * BigInt(key) + BigInt(input.offset)) %
            modulus) +
            modulus) %
            modulus,
        );
    const residues = Array.from(
      { length: input.bucketCount },
      (_, index) => index,
    ).filter((key) => hash(key) === input.targetBucket);
    if (residues.length === 0)
      return simpleError(
        "targetBucket",
        "The selected linear toy hash cannot reach that bucket.",
        "unreachable_bucket",
      );
    const random = createGeneratorRandom(input.seed, context),
      quotients = generatorSampleIndices(1001, input.collidingCount, random);
    const keys = quotients.map(
      (quotient) => random.pick(residues) + input.bucketCount * quotient,
    );
    // Noise comes from the first ten cycles of the integer bucket universe, with replacement.
    for (let index = 0; index < input.noiseCount; index += 1)
      keys.push(random.integer(0, input.bucketCount * 10 - 1));
    const buckets = keys.map(hash),
      frequencies = new Map(
        sequenceCounts(buckets.map(String)).map((entry) => [
          entry.key,
          entry.count,
        ]),
      );
    const bucketCounts = Array.from(
        { length: input.bucketCount },
        (_, bucket) => frequencies.get(String(bucket)) ?? 0,
      ),
      collisionPairs: number[][] = [];
    for (let first = 0; first < buckets.length; first += 1)
      for (let second = first + 1; second < buckets.length; second += 1)
        if (buckets[first] === buckets[second])
          collisionPairs.push([first, second]);
    return toolSuccess({
      keys,
      buckets,
      plantedCollisionCount: input.collidingCount,
      bucketCounts,
      collisionPairs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const hashTableCollisionWorkloadExample = {
  input: {
    bucketCount: 3,
    targetBucket: 1,
    multiplier: 1,
    offset: 0,
    collidingCount: 2,
    noiseCount: 1,
    seed: 42,
  },
  output: {
    keys: [1804, 1345, 5],
    buckets: [1, 1, 2],
    plantedCollisionCount: 2,
    bucketCounts: [0, 2, 1],
    collisionPairs: [[0, 1]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HashTableCollisionWorkloadInput,
  HashTableCollisionWorkloadOutput
>;
export const hashTableCollisionWorkloadTool = createModelDefinition<
  HashTableCollisionWorkloadInput,
  HashTableCollisionWorkloadOutput
>({
  id: "random/hash-table-collision-workload",
  title: "Random Hash Table Collision Workload Generator",
  description:
    "Solve residues for the caller's toy linear modular hash, construct distinct planted colliding integer keys and bounded noise, then retain bucket counts and every actual collision pair; no cryptographic collision claim.",
  inputSchema,
  outputSchema,
  execute: calculateHashTableCollisionWorkload,
});
export const runHashTableCollisionWorkload =
  hashTableCollisionWorkloadTool.execute;
export default hashTableCollisionWorkloadTool;
