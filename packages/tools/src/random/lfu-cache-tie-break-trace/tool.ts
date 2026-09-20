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
  type GeneratorReplay,
} from "../generator-random.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  booleanSchema,
  nullableSchema,
  enumSchema,
  distinct,
} from "../m500b-csv-algorithms-schemas.js";
import { sequenceCounts } from "../m500b-csv-algorithms-sequence.js";

export type LfuCacheTieBreakTraceInput = {
  readonly keys: readonly string[];
  readonly capacity: number;
  readonly extraRequests: number;
  readonly tiePolicy: "fifo" | "lru" | "lexicographic";
  readonly seed?: number;
};
type Resident = { readonly key: string; readonly count: number };
type LfuEvent = {
  readonly key: string;
  readonly hit: boolean;
  readonly evicted: string | null;
  readonly tieCandidates: readonly string[];
  readonly residents: readonly Resident[];
};
export type LfuCacheTieBreakTraceOutput = {
  readonly requests: readonly string[];
  readonly events: readonly LfuEvent[];
  readonly counts: readonly Resident[];
  readonly randomness: GeneratorReplay;
};
const residentSchema = objectSchema({
  key: textSchema,
  count: countSchema(41, 1),
});
export const inputSchema = objectSchema(
  {
    keys: arraySchema(textSchema, 16, 2),
    capacity: countSchema(8, 1),
    extraRequests: countSchema(32),
    tiePolicy: enumSchema(["fifo", "lru", "lexicographic"]),
    seed: generatorSeedSchema,
  },
  ["keys", "capacity", "extraRequests", "tiePolicy"],
);
export const outputSchema = objectSchema({
  requests: arraySchema(textSchema, 41),
  events: arraySchema(
    objectSchema({
      key: textSchema,
      hit: booleanSchema,
      evicted: nullableSchema(textSchema),
      tieCandidates: arraySchema(textSchema, 8),
      residents: arraySchema(residentSchema, 8),
    }),
    41,
  ),
  counts: arraySchema(residentSchema, 16),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is LfuCacheTieBreakTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateLfuCacheTieBreakTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LfuCacheTieBreakTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.keys, "keys");
    if (input.capacity >= input.keys.length)
      return simpleError(
        "capacity",
        "At least capacity plus one distinct keys are needed to plant an eviction tie.",
        "insufficient_tie_keys",
      );
    const random = createGeneratorRandom(input.seed, context),
      requests = random.shuffle(input.keys).slice(0, input.capacity + 1);
    for (let index = 0; index < input.extraRequests; index += 1)
      requests.push(random.pick(input.keys));
    const cache = new Map<
      string,
      { count: number; inserted: number; lastUsed: number }
    >();
    const events = requests.map((key, tick): LfuEvent => {
      const resident = cache.get(key),
        hit = resident !== undefined;
      let evicted: string | null = null,
        tieCandidates: string[] = [];
      if (resident) {
        resident.count += 1;
        resident.lastUsed = tick;
      } else {
        if (cache.size === input.capacity) {
          const minimum = Math.min(
            ...[...cache.values()].map((entry) => entry.count),
          );
          const candidates = [...cache.entries()].filter(
            ([, entry]) => entry.count === minimum,
          );
          tieCandidates = candidates.map(([candidate]) => candidate);
          candidates.sort(([keyA, a], [keyB, b]) =>
            input.tiePolicy === "lexicographic"
              ? keyA < keyB
                ? -1
                : keyA > keyB
                  ? 1
                  : 0
              : input.tiePolicy === "fifo"
                ? a.inserted - b.inserted
                : a.lastUsed - b.lastUsed,
          );
          const selected = candidates[0];
          if (!selected) throw new Error("No LFU eviction candidate.");
          evicted = selected[0];
          cache.delete(evicted);
        }
        cache.set(key, { count: 1, inserted: tick, lastUsed: tick });
      }
      return {
        key,
        hit,
        evicted,
        tieCandidates,
        residents: [...cache].map(([residentKey, entry]) => ({
          key: residentKey,
          count: entry.count,
        })),
      };
    });
    return toolSuccess({
      requests,
      events,
      counts: sequenceCounts(requests),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const lfuCacheTieBreakTraceExample = {
  input: {
    keys: ["a", "b", "c"],
    capacity: 2,
    extraRequests: 1,
    tiePolicy: "fifo",
    seed: 42,
  },
  output: {
    requests: ["c", "a", "b", "c"],
    events: [
      {
        key: "c",
        hit: false,
        evicted: null,
        tieCandidates: [],
        residents: [{ key: "c", count: 1 }],
      },
      {
        key: "a",
        hit: false,
        evicted: null,
        tieCandidates: [],
        residents: [
          { key: "c", count: 1 },
          { key: "a", count: 1 },
        ],
      },
      {
        key: "b",
        hit: false,
        evicted: "c",
        tieCandidates: ["c", "a"],
        residents: [
          { key: "a", count: 1 },
          { key: "b", count: 1 },
        ],
      },
      {
        key: "c",
        hit: false,
        evicted: "a",
        tieCandidates: ["a", "b"],
        residents: [
          { key: "b", count: 1 },
          { key: "c", count: 1 },
        ],
      },
    ],
    counts: [
      { key: "c", count: 2 },
      { key: "a", count: 1 },
      { key: "b", count: 1 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  LfuCacheTieBreakTraceInput,
  LfuCacheTieBreakTraceOutput
>;
export const lfuCacheTieBreakTraceTool = createModelDefinition<
  LfuCacheTieBreakTraceInput,
  LfuCacheTieBreakTraceOutput
>({
  id: "random/lfu-cache-tie-break-trace",
  title: "Random LFU Cache Tie Break Trace Generator",
  description:
    "Plant an equal-frequency eviction tie when capacity is at least two; capacity one is an explicit single-candidate eviction control. Retain FIFO, LRU or lexical choices and resident counts that reset after eviction.",
  inputSchema,
  outputSchema,
  execute: calculateLfuCacheTieBreakTrace,
});
export const runLfuCacheTieBreakTrace = lfuCacheTieBreakTraceTool.execute;
export default lfuCacheTieBreakTraceTool;
