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
  snArray,
  snBoundOutput,
  snCopyRecord,
  snInteger,
  snObject,
  snProbability,
  snRecord,
  type SamplingRecord,
} from "../m250-sampling-narrative-support.js";

export type ReservoirEntry = {
  readonly streamIndex: number;
  readonly record: SamplingRecord;
};
export type ReservoirState = {
  readonly capacity: number;
  readonly seen: number;
  readonly reservoir: readonly ReservoirEntry[];
  readonly randomness: GeneratorReplay;
};
export type ReservoirStreamSampleInput = {
  readonly capacity: number;
  readonly chunk: readonly SamplingRecord[];
  readonly state?: ReservoirState;
  readonly seed?: number;
};
export type ReservoirStreamSampleOutput = {
  readonly state: ReservoirState;
  readonly updates: readonly {
    readonly streamIndex: number;
    readonly decision: {
      readonly draw: number | null;
      readonly slot: number | null;
      readonly action: "fill" | "replace" | "skip";
    };
  }[];
  readonly inclusionProbability: number;
  readonly randomness: GeneratorReplay;
};
const capacitySchema = { type: "integer", minimum: 0, maximum: 512 } as const;
const entrySchema = snObject({ streamIndex: snInteger, record: snRecord });
export const reservoirStateSchema = snObject({
  capacity: capacitySchema,
  seen: { type: "integer", minimum: 0, maximum: 100000 },
  reservoir: snArray(entrySchema, 512),
  randomness: generatorReplaySchema,
});
export const inputSchema = snObject(
  {
    capacity: capacitySchema,
    chunk: snArray(snRecord, 2048),
    state: reservoirStateSchema,
    seed: generatorSeedSchema,
  },
  ["capacity", "chunk"],
);
export const outputSchema = snObject({
  state: reservoirStateSchema,
  updates: snArray(
    snObject({
      streamIndex: snInteger,
      decision: snObject({
        draw: { anyOf: [snInteger, { type: "null" }] },
        slot: { anyOf: [snInteger, { type: "null" }] },
        action: { type: "string", enum: ["fill", "replace", "skip"] },
      }),
    }),
    2048,
  ),
  inclusionProbability: snProbability,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is ReservoirStreamSampleInput =>
  matchesModelInput(input, inputSchema);
export const calculateReservoirStreamSample = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ReservoirStreamSampleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const previous = input.state,
      before = previous?.seen ?? 0;
    if (before + input.chunk.length > 100000)
      simpleError(
        "chunk",
        "Cumulative stream processing is bounded to 100000 records.",
        "resource_limit_exceeded",
      );
    if (previous) {
      const positions = previous.reservoir.map((entry) => entry.streamIndex);
      if (
        previous.capacity !== input.capacity ||
        positions.length !== Math.min(input.capacity, before) ||
        new Set(positions).size !== positions.length ||
        positions.some((position) => position >= before) ||
        (before <= input.capacity &&
          positions.some((position, i) => position !== i))
      )
        simpleError(
          "state",
          "Reservoir state capacity, size, or source indices are inconsistent.",
          "invalid_reservoir_state",
        );
      const replay = previous.randomness;
      if (
        (replay.source === "seed" &&
          (replay.seed === null ||
            replay.seed < 0 ||
            replay.seed > 4294967295)) ||
        (replay.source === "context" && replay.seed !== null)
      )
        simpleError(
          "state",
          "Replay metadata is inconsistent.",
          "invalid_reservoir_state",
        );
      if (
        input.seed !== undefined &&
        (replay.source !== "seed" || input.seed >>> 0 !== replay.seed)
      )
        simpleError(
          "seed",
          "A resumed stream must retain its original seed or context source.",
          "state_seed_mismatch",
        );
      if (replay.source === "context" && !context?.random)
        simpleError(
          "state",
          "Context continuation requires the original advancing source.",
          "missing_continuation_source",
        );
    }
    const seed =
      previous?.randomness.source === "seed"
        ? (previous.randomness.seed ?? undefined)
        : input.seed;
    const random = createGeneratorRandom(seed, context),
      randomness = previous
        ? { ...previous.randomness }
        : generatorReplay(seed, context);
    // Every prior post-fill record consumed exactly one draw when capacity is positive.
    if (previous?.randomness.source === "seed" && input.capacity > 0)
      for (let i = input.capacity; i < before; i += 1) random.unit();
    const reservoir =
      previous?.reservoir.map((entry) => ({
        streamIndex: entry.streamIndex,
        record: snCopyRecord(entry.record),
      })) ?? [];
    const updates = input.chunk.map(
      (record, i): ReservoirStreamSampleOutput["updates"][number] => {
        const streamIndex = before + i;
        if (input.capacity === 0)
          return {
            streamIndex,
            decision: { draw: null, slot: null, action: "skip" },
          };
        if (streamIndex < input.capacity) {
          reservoir.push({ streamIndex, record: snCopyRecord(record) });
          return {
            streamIndex,
            decision: { draw: null, slot: streamIndex, action: "fill" },
          };
        }
        const draw = random.integer(0, streamIndex);
        if (draw < input.capacity) {
          reservoir[draw] = { streamIndex, record: snCopyRecord(record) };
          return {
            streamIndex,
            decision: { draw, slot: draw, action: "replace" },
          };
        }
        return { streamIndex, decision: { draw, slot: null, action: "skip" } };
      },
    );
    const seen = before + input.chunk.length;
    return toolSuccess(
      snBoundOutput({
        state: { capacity: input.capacity, seen, reservoir, randomness },
        updates,
        inclusionProbability:
          seen === 0 ? 0 : Math.min(input.capacity, seen) / seen,
        randomness,
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const reservoirStreamSampleExample = {
  input: {
    capacity: 2,
    chunk: [
      { id: "A", values: ["oak"] },
      { id: "B", values: ["pine"] },
      { id: "C", values: ["elm"] },
      { id: "D", values: ["ash"] },
    ],
    seed: 42,
  },
  output: {
    state: {
      capacity: 2,
      seen: 4,
      reservoir: [
        { streamIndex: 0, record: { id: "A", values: ["oak"] } },
        { streamIndex: 3, record: { id: "D", values: ["ash"] } },
      ],
      randomness: { seed: 42, source: "seed" },
    },
    updates: [
      { streamIndex: 0, decision: { draw: null, slot: 0, action: "fill" } },
      { streamIndex: 1, decision: { draw: null, slot: 1, action: "fill" } },
      { streamIndex: 2, decision: { draw: 1, slot: 1, action: "replace" } },
      { streamIndex: 3, decision: { draw: 1, slot: 1, action: "replace" } },
    ],
    inclusionProbability: 0.5,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  ReservoirStreamSampleInput,
  ReservoirStreamSampleOutput
>;
export const reservoirStreamSampleTool = createModelDefinition<
  ReservoirStreamSampleInput,
  ReservoirStreamSampleOutput
>({
  id: "random/reservoir-stream-sample",
  title: "Random Reservoir Stream Sample Generator",
  description:
    "Apply Algorithm R to ordered supplied records, returning portable reservoir state and update decisions with deterministic seeded chunk continuation.",
  inputSchema,
  outputSchema,
  execute: calculateReservoirStreamSample,
});
export const runReservoirStreamSample = reservoirStreamSampleTool.execute;
export default reservoirStreamSampleTool;
