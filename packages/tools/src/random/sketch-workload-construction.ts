import { runUnique } from "../list/unique/tool.js";
import { runIntersection } from "../set/intersection/tool.js";
import { runUnion } from "../set/union/tool.js";
import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
export const sketchUniverseSchema = {
  type: "array",
  minItems: 1,
  maxItems: 512,
  items: { type: "string", maxLength: 64 },
} as const;
export const sketchUniqueUniverse = (values: readonly string[]): string[] => {
  const result = runUnique({ values });
  if (!result.ok)
    throw new Error(
      "A bounded string universe was rejected by the unique-list core.",
    );
  return result.output.values as string[];
};
export const sketchMembershipQueries = (
  present: readonly string[],
  absent: readonly string[],
  count: number,
  presentProbability: number,
  random: GeneratorRandom,
): string[] => {
  if (presentProbability > 0 && present.length === 0)
    return simpleError(
      "presentQueryProbability",
      "Positive-probability present queries require at least one present value.",
      "empty_present_pool",
    );
  if (presentProbability < 1 && absent.length === 0)
    return simpleError(
      "presentQueryProbability",
      "Positive-probability absent queries require at least one absent value.",
      "empty_absent_pool",
    );
  return Array.from({ length: count }, () =>
    random.pick(random.unit() < presentProbability ? present : absent),
  );
};
export const sketchSetPair = (
  universe: readonly string[],
  leftCount: number,
  rightCount: number,
  sharedCount: number,
  random: GeneratorRandom,
): {
  left: string[];
  right: string[];
  intersection: string[];
  union: string[];
  exactJaccard: number;
} => {
  if (sharedCount > Math.min(leftCount, rightCount))
    return simpleError(
      "sharedCount",
      "Shared size cannot exceed either set size.",
      "invalid_shared_count",
    );
  if (leftCount + rightCount - sharedCount > universe.length)
    return simpleError(
      "universe",
      "The deduplicated universe cannot supply the requested union.",
      "insufficient_universe",
    );
  const selected = random.shuffle(universe),
    shared = selected.slice(0, sharedCount),
    leftOnly = selected.slice(sharedCount, leftCount),
    rightOnly = selected.slice(leftCount, leftCount + rightCount - sharedCount);
  const left = random.shuffle([...shared, ...leftOnly]),
    right = random.shuffle([...shared, ...rightOnly]);
  const intersection = runIntersection({ first: left, second: right }),
    union = runUnion({ first: left, second: right });
  if (!intersection.ok || !union.ok)
    throw new Error("Generated bounded sets were rejected by a set core.");
  const common = intersection.output.values as string[],
    combined = union.output.values as string[];
  if (
    common.length !== sharedCount ||
    combined.length !== leftCount + rightCount - sharedCount
  )
    throw new Error("Set-pair construction violated requested cardinalities.");
  return {
    left,
    right,
    intersection: common,
    union: combined,
    exactJaccard: combined.length === 0 ? 1 : common.length / combined.length,
  };
};
