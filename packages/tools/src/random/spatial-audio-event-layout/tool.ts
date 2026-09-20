import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
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
import { calculateInverseSquareLawLevelChange } from "../../acoustics/inverse-square-law-level-change/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  rangeSchema,
  drawReal,
  orderedRange,
  distanceFromCore,
  finiteNumber,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type SpatialAudioPoint = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};
export type SpatialAudioEventLayoutInput = {
  readonly count: number;
  readonly listener: SpatialAudioPoint;
  readonly sourceX: NumericRange;
  readonly sourceY: NumericRange;
  readonly sourceZ: NumericRange;
  readonly referenceLevelDb: NumericRange;
  readonly referenceDistanceMeters: number;
  readonly minimumDistanceMeters: number;
  readonly maximumAttemptsPerEvent: number;
  readonly seed?: number;
};
export type SpatialAudioEventLayoutOutput = {
  readonly listener: SpatialAudioPoint;
  readonly events: readonly {
    readonly index: number;
    readonly source: SpatialAudioPoint;
    readonly distanceMeters: number;
    readonly referenceLevelDb: number;
    readonly levelChangeDb: number;
    readonly nominalListenerLevelDb: number;
    readonly attempts: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const point = objectSchema({
  x: numberSchema,
  y: numberSchema,
  z: numberSchema,
});
export const inputSchema = objectSchema(
  {
    count: countSchema(64),
    listener: point,
    sourceX: rangeSchema(),
    sourceY: rangeSchema(),
    sourceZ: rangeSchema(),
    referenceLevelDb: rangeSchema(),
    referenceDistanceMeters: positiveSchema,
    minimumDistanceMeters: positiveSchema,
    maximumAttemptsPerEvent: countSchema(128),
    seed: generatorSeedSchema,
  },
  [
    "count",
    "listener",
    "sourceX",
    "sourceY",
    "sourceZ",
    "referenceLevelDb",
    "referenceDistanceMeters",
    "minimumDistanceMeters",
    "maximumAttemptsPerEvent",
  ],
);
export const outputSchema = objectSchema({
  listener: point,
  events: arraySchema(
    objectSchema({
      index: countSchema(63, 0),
      source: point,
      distanceMeters: positiveSchema,
      referenceLevelDb: numberSchema,
      levelChangeDb: numberSchema,
      nominalListenerLevelDb: numberSchema,
      attempts: countSchema(128),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SpatialAudioEventLayoutInput =>
  matchesModelInput(value, inputSchema);
export const calculateSpatialAudioEventLayout = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SpatialAudioEventLayoutOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const field of [
      "sourceX",
      "sourceY",
      "sourceZ",
      "referenceLevelDb",
    ] as const)
      orderedRange(input[field], field);
    const random = createGeneratorRandom(input.seed, context),
      events: SpatialAudioEventLayoutOutput["events"][number][] = [];
    for (let index = 0; index < input.count; index++) {
      let found = false;
      for (
        let attempts = 1;
        attempts <= input.maximumAttemptsPerEvent;
        attempts++
      ) {
        const source = {
          x: drawReal(input.sourceX, random, "sourceX"),
          y: drawReal(input.sourceY, random, "sourceY"),
          z: drawReal(input.sourceZ, random, "sourceZ"),
        };
        const distanceMeters = distanceFromCore(
          input.listener,
          source,
          "sourceX",
        );
        if (distanceMeters < input.minimumDistanceMeters) continue;
        const referenceLevelDb = drawReal(
            input.referenceLevelDb,
            random,
            "referenceLevelDb",
          ),
          levelChangeDb = calculateInverseSquareLawLevelChange({
            initialMeters: input.referenceDistanceMeters,
            finalMeters: distanceMeters,
          }).changeDecibels;
        events.push({
          index,
          source,
          distanceMeters,
          referenceLevelDb,
          levelChangeDb,
          nominalListenerLevelDb: finiteNumber(
            referenceLevelDb + levelChangeDb,
            "referenceLevelDb",
          ),
          attempts,
        });
        found = true;
        break;
      }
      if (!found)
        simpleError(
          "maximumAttemptsPerEvent",
          "No source position met the separation constraint within the draw budget.",
          "search_exhausted",
        );
    }
    return toolSuccess(
      ensureOutput(
        {
          listener: { ...input.listener },
          events,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const spatialAudioEventLayoutExample = {
  input: {
    count: 1,
    listener: {
      x: 0,
      y: 0,
      z: 0,
    },
    sourceX: {
      minimum: 3,
      maximum: 3,
    },
    sourceY: {
      minimum: 4,
      maximum: 4,
    },
    sourceZ: {
      minimum: 0,
      maximum: 0,
    },
    referenceLevelDb: {
      minimum: 80,
      maximum: 80,
    },
    referenceDistanceMeters: 1,
    minimumDistanceMeters: 1,
    maximumAttemptsPerEvent: 8,
    seed: 42,
  },
  output: {
    listener: {
      x: 0,
      y: 0,
      z: 0,
    },
    events: [
      {
        index: 0,
        source: {
          x: 3,
          y: 4,
          z: 0,
        },
        distanceMeters: 5,
        referenceLevelDb: 80,
        levelChangeDb: -13.979400086720377,
        nominalListenerLevelDb: 66.02059991327963,
        attempts: 1,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  SpatialAudioEventLayoutInput,
  SpatialAudioEventLayoutOutput
>;
export const spatialAudioEventLayoutTool = createModelDefinition<
  SpatialAudioEventLayoutInput,
  SpatialAudioEventLayoutOutput
>({
  id: "random/spatial-audio-event-layout",
  title: "Random Spatial Audio Event Layout Generator",
  description:
    "Generate fictional source positions and nominal listener levels under an explicit free-field distance model with bounded separation search.",
  inputSchema,
  outputSchema,
  execute: calculateSpatialAudioEventLayout,
});
export const runSpatialAudioEventLayout = spatialAudioEventLayoutTool.execute;
export default spatialAudioEventLayoutTool;
