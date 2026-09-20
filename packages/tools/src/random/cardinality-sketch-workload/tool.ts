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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { hyperLogLog } from "../../data-structure/hash-sketch.js";
import {
  sketchUniverseSchema,
  sketchUniqueUniverse,
} from "../sketch-workload-construction.js";

export type CardinalitySketchWorkloadInput = {
  readonly universe: readonly string[];
  readonly streamLength: number;
  readonly distinctCount: number;
  readonly precision: number;
  readonly seed?: number;
};
export type CardinalitySketchWorkloadOutput = {
  readonly stream: readonly string[];
  readonly exact: {
    readonly uniqueCount: number;
    readonly duplicateCount: number;
    readonly duplicateFraction: number | null;
  };
  readonly sketch: {
    readonly estimate: number;
    readonly registers: number;
    readonly signedError: number;
    readonly relativeError: number | null;
  };
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: sketchUniverseSchema,
    streamLength: { type: "integer", minimum: 0, maximum: 2048 },
    distinctCount: { type: "integer", minimum: 0, maximum: 512 },
    precision: { type: "integer", minimum: 4, maximum: 16 },
    seed: generatorSeedSchema,
  },
  required: ["universe", "streamLength", "distinctCount", "precision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stream: {
      type: "array",
      maxItems: 2048,
      items: { type: "string", maxLength: 64 },
    },
    exact: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueCount: { type: "integer", minimum: 0, maximum: 512 },
        duplicateCount: { type: "integer", minimum: 0, maximum: 2048 },
        duplicateFraction: {
          anyOf: [{ type: "number", minimum: 0, maximum: 1 }, { type: "null" }],
        },
      },
      required: ["uniqueCount", "duplicateCount", "duplicateFraction"],
    },
    sketch: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimate: { type: "number", minimum: 0 },
        registers: { type: "integer", minimum: 16, maximum: 65536 },
        signedError: { type: "number" },
        relativeError: { anyOf: [{ type: "number" }, { type: "null" }] },
      },
      required: ["estimate", "registers", "signedError", "relativeError"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["stream", "exact", "sketch", "randomness"],
} as const;

const isInput = (input: unknown): input is CardinalitySketchWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateCardinalitySketchWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CardinalitySketchWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const universe = sketchUniqueUniverse(input.universe);
    if (
      input.distinctCount > universe.length ||
      input.distinctCount > input.streamLength ||
      (input.streamLength > 0 && input.distinctCount === 0)
    )
      simpleError(
        "distinctCount",
        "Use a feasible distinct count within both the deduplicated universe and stream length; nonempty streams need at least one value.",
        "infeasible_distinct_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      selected = random.shuffle(universe).slice(0, input.distinctCount),
      occurrences = [...selected];
    while (occurrences.length < input.streamLength)
      occurrences.push(random.pick(selected));
    const stream = random.shuffle(occurrences),
      uniqueCount = sketchUniqueUniverse(stream).length;
    if (uniqueCount !== input.distinctCount)
      throw new Error(
        "Cardinality workload failed its exact distinct-count construction.",
      );
    const result = hyperLogLog(stream, input.precision),
      signedError = result.estimate - uniqueCount,
      duplicateCount = stream.length - uniqueCount;
    return toolSuccess({
      stream,
      exact: {
        uniqueCount,
        duplicateCount,
        duplicateFraction:
          stream.length === 0 ? null : duplicateCount / stream.length,
      },
      sketch: {
        ...result,
        signedError,
        relativeError: uniqueCount === 0 ? null : signedError / uniqueCount,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cardinalitySketchWorkloadExample = {
  input: {
    universe: ["a", "b", "c", "d"],
    streamLength: 8,
    distinctCount: 3,
    precision: 4,
    seed: 42,
  },
  output: {
    stream: ["d", "d", "a", "b", "a", "d", "b", "a"],
    exact: {
      uniqueCount: 3,
      duplicateCount: 5,
      duplicateFraction: 0.625,
    },
    sketch: {
      estimate: 2.136502281992361,
      registers: 16,
      signedError: -0.8634977180076389,
      relativeError: -0.28783257266921297,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CardinalitySketchWorkloadInput,
  CardinalitySketchWorkloadOutput
>;
export const cardinalitySketchWorkloadTool = createModelDefinition<
  CardinalitySketchWorkloadInput,
  CardinalitySketchWorkloadOutput
>({
  id: "random/cardinality-sketch-workload",
  title: "Random Cardinality Sketch Workload Generator",
  description:
    "Construct a seeded shuffled stream with an exact caller-selected number of distinct strings and duplicate occurrences, then delegate the existing fixed-hash HyperLogLog estimate; report signed and relative errors separately from exact cardinality, with null duplicate/relative fractions when their denominator is zero.",
  inputSchema,
  outputSchema,
  execute: calculateCardinalitySketchWorkload,
});
export const runCardinalitySketchWorkload =
  cardinalitySketchWorkloadTool.execute;
export default cardinalitySketchWorkloadTool;
