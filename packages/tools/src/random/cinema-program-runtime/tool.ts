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
import { addNumbers } from "../../arithmetic/add-numbers/tool.js";
import { runMean } from "../../statistics/mean/tool.js";
import { calculateTrailerRuntimeTotal } from "../../film/trailer-runtime-total/tool.js";
import { calculateFeatureRuntimeWithTrailers } from "../../film/feature-runtime-with-trailers/tool.js";
import { calculateIntermissionTime } from "../../film/intermission-time/tool.js";
import { generatorSampleIndices } from "../generator-random.js";

export type CinemaClip = {
  readonly id: string;
  readonly title: string;
  readonly minutes: number;
};
export type CinemaProgramRuntimeInput = {
  readonly features: readonly CinemaClip[];
  readonly trailers: readonly CinemaClip[];
  readonly featureCount: number;
  readonly trailerCount: number;
  readonly withoutReplacement: boolean;
  readonly breakMinutes: readonly number[];
  readonly seed?: number;
};
export type CinemaProgramRuntimeOutput = {
  readonly features: readonly CinemaClip[];
  readonly trailers: readonly CinemaClip[];
  readonly breaks: readonly number[];
  readonly timeline: readonly {
    readonly kind: "feature" | "trailer" | "intermission";
    readonly id: string | null;
    readonly title: string | null;
    readonly minutes: number;
    readonly startMinute: number;
    readonly endMinute: number;
  }[];
  readonly featureMinutes: number;
  readonly trailerMinutes: number;
  readonly meanTrailerMinutes: number | null;
  readonly estimatedTrailerMinutes: number;
  readonly intermissionMinutes: number;
  readonly programMinutes: number;
  readonly timelineEndMinute: number;
  readonly randomness: GeneratorReplay;
};
const amountSchema = { type: "number", minimum: 0 } as const,
  clipSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      id: { type: "string", minLength: 1, maxLength: 128 },
      title: { type: "string", minLength: 1, maxLength: 512 },
      minutes: amountSchema,
    },
    required: ["id", "title", "minutes"],
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    features: { type: "array", minItems: 1, maxItems: 64, items: clipSchema },
    trailers: { type: "array", maxItems: 64, items: clipSchema },
    featureCount: { type: "integer", minimum: 1, maximum: 16 },
    trailerCount: { type: "integer", minimum: 0, maximum: 32 },
    withoutReplacement: { type: "boolean" },
    breakMinutes: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: amountSchema,
    },
    seed: generatorSeedSchema,
  },
  required: [
    "features",
    "trailers",
    "featureCount",
    "trailerCount",
    "withoutReplacement",
    "breakMinutes",
  ],
} as const;
const nullableText = { anyOf: [{ type: "string" }, { type: "null" }] } as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    features: { type: "array", minItems: 1, maxItems: 16, items: clipSchema },
    trailers: { type: "array", maxItems: 32, items: clipSchema },
    breaks: { type: "array", maxItems: 15, items: amountSchema },
    timeline: {
      type: "array",
      minItems: 1,
      maxItems: 63,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: {
            type: "string",
            enum: ["feature", "trailer", "intermission"],
          },
          id: nullableText,
          title: nullableText,
          minutes: amountSchema,
          startMinute: amountSchema,
          endMinute: amountSchema,
        },
        required: [
          "kind",
          "id",
          "title",
          "minutes",
          "startMinute",
          "endMinute",
        ],
      },
    },
    featureMinutes: amountSchema,
    trailerMinutes: amountSchema,
    meanTrailerMinutes: { anyOf: [amountSchema, { type: "null" }] },
    estimatedTrailerMinutes: amountSchema,
    intermissionMinutes: amountSchema,
    programMinutes: amountSchema,
    timelineEndMinute: amountSchema,
    randomness: generatorReplaySchema,
  },
  required: [
    "features",
    "trailers",
    "breaks",
    "timeline",
    "featureMinutes",
    "trailerMinutes",
    "meanTrailerMinutes",
    "estimatedTrailerMinutes",
    "intermissionMinutes",
    "programMinutes",
    "timelineEndMinute",
    "randomness",
  ],
} as const;
const sumCinemaMinutes = (values: readonly number[]): number => {
  if (!values.length) return 0;
  const value = addNumbers(values);
  if (value === null || !Number.isFinite(value))
    return simpleError(
      "features",
      "Program arithmetic exceeds the finite numeric domain.",
      "runtime_overflow",
    );
  return value;
};
const isInput = (input: unknown): input is CinemaProgramRuntimeInput =>
  matchesModelInput(input, inputSchema);
export const calculateCinemaProgramRuntime = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CinemaProgramRuntimeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const bank of [input.features, input.trailers])
      if (new Set(bank.map((clip) => clip.id)).size !== bank.length)
        simpleError(
          "features",
          "Clip IDs must be distinct within each supplied bank.",
          "duplicate_clip",
        );
    if (input.trailerCount && !input.trailers.length)
      simpleError(
        "trailers",
        "A positive trailer count requires supplied clips.",
        "empty_trailer_bank",
      );
    if (
      input.withoutReplacement &&
      (input.featureCount > input.features.length ||
        input.trailerCount > input.trailers.length)
    )
      simpleError(
        "withoutReplacement",
        "Requested distinct counts exceed a supplied bank.",
        "insufficient_clips",
      );
    const random = createGeneratorRandom(input.seed, context),
      sample = (bank: readonly CinemaClip[], count: number): CinemaClip[] =>
        (input.withoutReplacement
          ? generatorSampleIndices(bank.length, count, random)
          : Array.from({ length: count }, () =>
              random.integer(0, bank.length - 1),
            )
        ).map((i) => bank[i]);
    const features = sample(input.features, input.featureCount),
      trailers = sample(input.trailers, input.trailerCount),
      breaks = Array.from(
        { length: features.length - 1 },
        () =>
          calculateIntermissionTime({
            pauseAtMinute: 0,
            resumeAtMinute: random.pick(input.breakMinutes),
          }).intermissionMinutes,
      );
    const featureMinutes = sumCinemaMinutes(
        features.map((clip) => clip.minutes),
      ),
      trailerMinutes = sumCinemaMinutes(trailers.map((clip) => clip.minutes)),
      intermissionMinutes = sumCinemaMinutes(breaks);
    let meanTrailerMinutes: number | null = null;
    if (trailers.length) {
      const mean = runMean({ values: trailers.map((clip) => clip.minutes) });
      if (!mean.ok)
        return simpleError(
          "trailers",
          "Trailer mean exceeds the finite numeric domain.",
          "runtime_overflow",
        );
      meanTrailerMinutes = mean.output.mean;
    }
    const { totalTrailerMinutes: estimatedTrailerMinutes } =
      calculateTrailerRuntimeTotal({
        trailerCount: trailers.length,
        meanTrailerMinutes: meanTrailerMinutes ?? 0,
      });
    const { programMinutes } = calculateFeatureRuntimeWithTrailers({
      featureMinutes,
      trailerMinutes,
      intermissionMinutes,
    });
    const timeline: CinemaProgramRuntimeOutput["timeline"][number][] = [];
    let cursor = 0;
    const append = (
      kind: "feature" | "trailer" | "intermission",
      minutes: number,
      clip?: CinemaClip,
    ): void => {
      const startMinute = cursor,
        endMinute = sumCinemaMinutes([cursor, minutes]);
      cursor = endMinute;
      timeline.push({
        kind,
        id: clip?.id ?? null,
        title: clip?.title ?? null,
        minutes,
        startMinute,
        endMinute,
      });
    };
    trailers.forEach((clip) => append("trailer", clip.minutes, clip));
    features.forEach((clip, i) => {
      append("feature", clip.minutes, clip);
      if (i < breaks.length) append("intermission", breaks[i]);
    });
    return toolSuccess({
      features,
      trailers,
      breaks,
      timeline,
      featureMinutes,
      trailerMinutes,
      meanTrailerMinutes,
      estimatedTrailerMinutes,
      intermissionMinutes,
      programMinutes,
      timelineEndMinute: cursor,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cinemaProgramRuntimeExample = {
  input: {
    features: [
      {
        id: "F1",
        title: "Supplied feature A",
        minutes: 90,
      },
      {
        id: "F2",
        title: "Supplied feature B",
        minutes: 100,
      },
      {
        id: "F3",
        title: "Supplied feature C",
        minutes: 110,
      },
    ],
    trailers: [
      {
        id: "T1",
        title: "Supplied trailer A",
        minutes: 1,
      },
      {
        id: "T2",
        title: "Supplied trailer B",
        minutes: 2,
      },
      {
        id: "T3",
        title: "Supplied trailer C",
        minutes: 3,
      },
    ],
    featureCount: 2,
    trailerCount: 2,
    withoutReplacement: true,
    breakMinutes: [5, 10],
    seed: 42,
  },
  output: {
    features: [
      {
        id: "F2",
        title: "Supplied feature B",
        minutes: 100,
      },
      {
        id: "F1",
        title: "Supplied feature A",
        minutes: 90,
      },
    ],
    trailers: [
      {
        id: "T3",
        title: "Supplied trailer C",
        minutes: 3,
      },
      {
        id: "T2",
        title: "Supplied trailer B",
        minutes: 2,
      },
    ],
    breaks: [5],
    timeline: [
      {
        kind: "trailer",
        id: "T3",
        title: "Supplied trailer C",
        minutes: 3,
        startMinute: 0,
        endMinute: 3,
      },
      {
        kind: "trailer",
        id: "T2",
        title: "Supplied trailer B",
        minutes: 2,
        startMinute: 3,
        endMinute: 5,
      },
      {
        kind: "feature",
        id: "F2",
        title: "Supplied feature B",
        minutes: 100,
        startMinute: 5,
        endMinute: 105,
      },
      {
        kind: "intermission",
        id: null,
        title: null,
        minutes: 5,
        startMinute: 105,
        endMinute: 110,
      },
      {
        kind: "feature",
        id: "F1",
        title: "Supplied feature A",
        minutes: 90,
        startMinute: 110,
        endMinute: 200,
      },
    ],
    featureMinutes: 190,
    trailerMinutes: 5,
    meanTrailerMinutes: 2.5,
    estimatedTrailerMinutes: 5,
    intermissionMinutes: 5,
    programMinutes: 200,
    timelineEndMinute: 200,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CinemaProgramRuntimeInput, CinemaProgramRuntimeOutput>;
export const cinemaProgramRuntimeTool = createModelDefinition<
  CinemaProgramRuntimeInput,
  CinemaProgramRuntimeOutput
>({
  id: "random/cinema-program-runtime",
  title: "Random Cinema Program Runtime Generator",
  description:
    "Sample supplied feature/trailer records, draw configured breaks between features, and return a relative-minute timeline plus delegated totals and mean-based trailer estimate. Trailers run once before the first feature; list sums and mean-times-count estimates remain separate full-precision values, and this is not venue scheduling or a clock/time-zone service.",
  inputSchema,
  outputSchema,
  execute: calculateCinemaProgramRuntime,
});
export const runCinemaProgramRuntime = cinemaProgramRuntimeTool.execute;
export default cinemaProgramRuntimeTool;
