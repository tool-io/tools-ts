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
import { calculateJustIntonationRatioToCents } from "../../music/just-intonation-ratio-to-cents/tool.js";
import { calculateEqualTemperamentRatioFromSemitones } from "../../music/equal-temperament-ratio-from-semitones/tool.js";
import { calculateCentsBetweenTwoFrequencies } from "../../music/cents-between-two-frequencies/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  requireDistinct,
  finiteNumber,
  ensureOutput,
} from "../m250-css-music-space-support.js";
export type TuningInterval = {
  readonly id: string;
  readonly numerator: number;
  readonly denominator: number;
  readonly matchedSemitones: number;
};
export type TuningSystemComparisonSetInput = {
  readonly count: number;
  readonly intervals: readonly TuningInterval[];
  readonly referenceHertz: number;
  readonly seed?: number;
};
export type TuningSystemComparisonSetOutput = {
  readonly referenceHertz: number;
  readonly comparisons: readonly {
    readonly intervalId: string;
    readonly numerator: number;
    readonly denominator: number;
    readonly matchedSemitones: number;
    readonly justRatio: number;
    readonly equalRatio: number;
    readonly justHertz: number;
    readonly equalHertz: number;
    readonly justCents: number;
    readonly equalCents: number;
    readonly differenceCents: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const interval = objectSchema({
  id: { type: "string", minLength: 1, maxLength: 64 },
  numerator: { type: "integer", minimum: 1 },
  denominator: { type: "integer", minimum: 1 },
  matchedSemitones: numberSchema,
});
export const inputSchema = objectSchema(
  {
    count: countSchema(128),
    intervals: arraySchema(interval, 64, 1),
    referenceHertz: positiveSchema,
    seed: generatorSeedSchema,
  },
  ["count", "intervals", "referenceHertz"],
);
export const outputSchema = objectSchema({
  referenceHertz: positiveSchema,
  comparisons: arraySchema(
    objectSchema({
      intervalId: { type: "string" },
      numerator: { type: "integer" },
      denominator: { type: "integer" },
      matchedSemitones: numberSchema,
      justRatio: positiveSchema,
      equalRatio: positiveSchema,
      justHertz: positiveSchema,
      equalHertz: positiveSchema,
      justCents: numberSchema,
      equalCents: numberSchema,
      differenceCents: numberSchema,
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is TuningSystemComparisonSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateTuningSystemComparisonSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<TuningSystemComparisonSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    requireDistinct(
      input.intervals.map((x) => x.id),
      "intervals",
    );
    // Preflight all supplied intervals so unsupported data cannot hide behind sampling.
    const evaluate = (interval: TuningInterval) => {
      const justRatio = interval.numerator / interval.denominator,
        equalRatio = calculateEqualTemperamentRatioFromSemitones({
          semitones: interval.matchedSemitones,
        }).frequencyRatio;
      const justHertz = finiteNumber(
          input.referenceHertz * justRatio,
          "referenceHertz",
        ),
        equalHertz = finiteNumber(
          input.referenceHertz * equalRatio,
          "referenceHertz",
        );
      if (justHertz <= 0 || equalHertz <= 0)
        simpleError(
          "referenceHertz",
          "Derived frequency underflowed positive representation.",
          "numeric_range",
        );
      const justCents = calculateJustIntonationRatioToCents({
          ratioNumerator: interval.numerator,
          ratioDenominator: interval.denominator,
        }).cents,
        equalCents = calculateCentsBetweenTwoFrequencies({
          referenceHertz: input.referenceHertz,
          targetHertz: equalHertz,
        }).cents,
        differenceCents = calculateCentsBetweenTwoFrequencies({
          referenceHertz: equalHertz,
          targetHertz: justHertz,
        }).cents;
      return {
        intervalId: interval.id,
        numerator: interval.numerator,
        denominator: interval.denominator,
        matchedSemitones: interval.matchedSemitones,
        justRatio,
        equalRatio,
        justHertz,
        equalHertz,
        justCents,
        equalCents,
        differenceCents,
      };
    };
    input.intervals.forEach(evaluate);
    const random = createGeneratorRandom(input.seed, context),
      comparisons = Array.from({ length: input.count }, () =>
        evaluate(random.pick(input.intervals)),
      );
    return toolSuccess(
      ensureOutput(
        {
          referenceHertz: input.referenceHertz,
          comparisons,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const tuningSystemComparisonSetExample = {
  input: {
    count: 2,
    intervals: [
      {
        id: "fifth",
        numerator: 3,
        denominator: 2,
        matchedSemitones: 7,
      },
      {
        id: "major-third",
        numerator: 5,
        denominator: 4,
        matchedSemitones: 4,
      },
    ],
    referenceHertz: 440,
    seed: 42,
  },
  output: {
    referenceHertz: 440,
    comparisons: [
      {
        intervalId: "major-third",
        numerator: 5,
        denominator: 4,
        matchedSemitones: 4,
        justRatio: 1.25,
        equalRatio: 1.2599210498948732,
        justHertz: 550,
        equalHertz: 554.3652619537442,
        justCents: 386.3137138648348,
        equalCents: 399.9999999999997,
        differenceCents: -13.686286135165112,
      },
      {
        intervalId: "fifth",
        numerator: 3,
        denominator: 2,
        matchedSemitones: 7,
        justRatio: 1.5,
        equalRatio: 1.4983070768766815,
        justHertz: 660,
        equalHertz: 659.2551138257398,
        justCents: 701.9550008653874,
        equalCents: 700,
        differenceCents: 1.9550008653876136,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  TuningSystemComparisonSetInput,
  TuningSystemComparisonSetOutput
>;
export const tuningSystemComparisonSetTool = createModelDefinition<
  TuningSystemComparisonSetInput,
  TuningSystemComparisonSetOutput
>({
  id: "random/tuning-system-comparison-set",
  title: "Random Tuning System Comparison Set Generator",
  description:
    "Sample supplied rational intervals and matched 12-TET steps into frequency and cents comparisons at an explicit reference frequency.",
  inputSchema,
  outputSchema,
  execute: calculateTuningSystemComparisonSet,
});
export const runTuningSystemComparisonSet =
  tuningSystemComparisonSetTool.execute;
export default tuningSystemComparisonSetTool;
