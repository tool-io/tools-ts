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
  distinct,
} from "../m500b-csv-algorithms-schemas.js";
import { sequenceCounts } from "../m500b-csv-algorithms-sequence.js";

export type LruCacheRequestTraceInput = {
  readonly keys: readonly string[];
  readonly capacity: number;
  readonly eventCount: number;
  readonly burstLength: number;
  readonly localityProbability: number;
  readonly seed?: number;
};
type LruEvent = {
  readonly key: string;
  readonly hit: boolean;
  readonly evicted: string | null;
  readonly recency: readonly string[];
};
export type LruCacheRequestTraceOutput = {
  readonly requests: readonly string[];
  readonly events: readonly LruEvent[];
  readonly hitCount: number;
  readonly counts: readonly { readonly key: string; readonly count: number }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    keys: arraySchema(textSchema, 16, 2),
    capacity: countSchema(16, 1),
    eventCount: countSchema(64, 1),
    burstLength: countSchema(8, 1),
    localityProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  ["keys", "capacity", "eventCount", "burstLength", "localityProbability"],
);
export const outputSchema = objectSchema({
  requests: arraySchema(textSchema, 64),
  events: arraySchema(
    objectSchema({
      key: textSchema,
      hit: booleanSchema,
      evicted: nullableSchema(textSchema),
      recency: arraySchema(textSchema, 16),
    }),
    64,
  ),
  hitCount: countSchema(64),
  counts: arraySchema(
    objectSchema({ key: textSchema, count: countSchema(64, 1) }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is LruCacheRequestTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateLruCacheRequestTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LruCacheRequestTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.keys, "keys");
    if (input.capacity > input.keys.length)
      return simpleError(
        "capacity",
        "Capacity must not exceed the supplied key universe.",
        "capacity_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      requests: string[] = [];
    let previous: string | null = null;
    while (requests.length < input.eventCount) {
      const key: string =
        previous !== null && random.unit() < input.localityProbability
          ? previous
          : random.pick(input.keys);
      const count = Math.min(
        input.burstLength,
        input.eventCount - requests.length,
      );
      for (let index = 0; index < count; index += 1) requests.push(key);
      previous = key;
    }
    const recency: string[] = [];
    const events = requests.map((key): LruEvent => {
      const index = recency.indexOf(key),
        hit = index >= 0;
      let evicted: string | null = null;
      if (hit) recency.splice(index, 1);
      else if (recency.length === input.capacity)
        evicted = recency.shift() ?? null;
      recency.push(key);
      return { key, hit, evicted, recency: [...recency] };
    });
    return toolSuccess({
      requests,
      events,
      hitCount: events.filter((event) => event.hit).length,
      counts: sequenceCounts(requests),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const lruCacheRequestTraceExample = {
  input: {
    keys: ["a", "b", "c"],
    capacity: 2,
    eventCount: 5,
    burstLength: 2,
    localityProbability: 0,
    seed: 42,
  },
  output: {
    requests: ["b", "b", "c", "c", "a"],
    events: [
      { key: "b", hit: false, evicted: null, recency: ["b"] },
      { key: "b", hit: true, evicted: null, recency: ["b"] },
      { key: "c", hit: false, evicted: null, recency: ["b", "c"] },
      { key: "c", hit: true, evicted: null, recency: ["b", "c"] },
      { key: "a", hit: false, evicted: "b", recency: ["c", "a"] },
    ],
    hitCount: 2,
    counts: [
      { key: "b", count: 2 },
      { key: "c", count: 2 },
      { key: "a", count: 1 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<LruCacheRequestTraceInput, LruCacheRequestTraceOutput>;
export const lruCacheRequestTraceTool = createModelDefinition<
  LruCacheRequestTraceInput,
  LruCacheRequestTraceOutput
>({
  id: "random/lru-cache-request-trace",
  title: "Random LRU Cache Request Trace Generator",
  description:
    "Generate bounded key bursts with declared previous-burst locality probability and retain least-to-most-recent cache snapshots, hits, evictions and exact global request counts.",
  inputSchema,
  outputSchema,
  execute: calculateLruCacheRequestTrace,
});
export const runLruCacheRequestTrace = lruCacheRequestTraceTool.execute;
export default lruCacheRequestTraceTool;
