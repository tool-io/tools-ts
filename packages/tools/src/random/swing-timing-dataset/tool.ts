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
import { runBpmToMs } from "../../music/bpm-to-ms/tool.js";
import { calculate as classifySwing } from "../../music/swing-ratio-percentage-classifier/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  coreOutput,
  finiteNumber,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type SwingTimingDatasetInput = {
  readonly count: number;
  readonly ratios: readonly {
    readonly first: number;
    readonly second: number;
  }[];
  readonly tempoBpm: NumericRange;
  readonly startMilliseconds: number;
  readonly straightShareTolerance: number;
  readonly seed?: number;
};
export type SwingTimingDatasetOutput = {
  readonly pairs: readonly {
    readonly index: number;
    readonly ratioFirst: number;
    readonly ratioSecond: number;
    readonly beatsPerMinute: number;
    readonly beatMilliseconds: number;
    readonly firstOnsetMilliseconds: number;
    readonly secondOnsetMilliseconds: number;
    readonly endMilliseconds: number;
    readonly firstDurationMilliseconds: number;
    readonly secondDurationMilliseconds: number;
    readonly firstSubdivisionSharePercent: number;
    readonly longToShortSubdivisionRatio: number;
    readonly swingTimingClass: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    count: countSchema(128),
    ratios: arraySchema(
      objectSchema({ first: positiveSchema, second: positiveSchema }),
      32,
      1,
    ),
    tempoBpm: rangeSchema({ type: "integer", minimum: 1 }),
    startMilliseconds: numberSchema,
    straightShareTolerance: {
      type: "number",
      minimum: 0,
      exclusiveMaximum: 0.5,
    },
    seed: generatorSeedSchema,
  },
  [
    "count",
    "ratios",
    "tempoBpm",
    "startMilliseconds",
    "straightShareTolerance",
  ],
);
export const outputSchema = objectSchema({
  pairs: arraySchema(
    objectSchema({
      index: countSchema(127, 0),
      ratioFirst: positiveSchema,
      ratioSecond: positiveSchema,
      beatsPerMinute: positiveSchema,
      beatMilliseconds: positiveSchema,
      firstOnsetMilliseconds: numberSchema,
      secondOnsetMilliseconds: numberSchema,
      endMilliseconds: numberSchema,
      firstDurationMilliseconds: positiveSchema,
      secondDurationMilliseconds: positiveSchema,
      firstSubdivisionSharePercent: numberSchema,
      longToShortSubdivisionRatio: positiveSchema,
      swingTimingClass: { type: "string" },
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is SwingTimingDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateSwingTimingDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SwingTimingDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.tempoBpm, "tempoBpm");
    const random = createGeneratorRandom(input.seed, context);
    let cursor = input.startMilliseconds;
    const pairs = Array.from({ length: input.count }, (_, index) => {
      const beatsPerMinute = drawInteger(input.tempoBpm, random, "tempoBpm"),
        ratio = random.pick(input.ratios),
        beatMilliseconds = coreOutput(
          runBpmToMs({ bpm: beatsPerMinute }),
        ).millisecondsPerBeat;
      const scale = Math.max(ratio.first, ratio.second),
        a = ratio.first / scale,
        b = ratio.second / scale,
        total = a + b;
      const firstDurationMilliseconds = (beatMilliseconds * a) / total,
        secondDurationMilliseconds = (beatMilliseconds * b) / total;
      if (firstDurationMilliseconds <= 0 || secondDurationMilliseconds <= 0)
        simpleError(
          "ratios",
          "Subdivision duration underflowed positive representation.",
          "numeric_range",
        );
      const firstOnsetMilliseconds = cursor,
        secondOnsetMilliseconds = finiteNumber(
          cursor + firstDurationMilliseconds,
          "startMilliseconds",
        ),
        endMilliseconds = finiteNumber(
          cursor + beatMilliseconds,
          "startMilliseconds",
        );
      if (!(
        firstOnsetMilliseconds < secondOnsetMilliseconds &&
        secondOnsetMilliseconds < endMilliseconds
      ))
        simpleError(
          "startMilliseconds",
          "Onset increments are below numeric precision at this start time.",
          "timing_precision",
        );
      cursor = endMilliseconds;
      return {
        index,
        ratioFirst: ratio.first,
        ratioSecond: ratio.second,
        beatsPerMinute,
        beatMilliseconds,
        firstOnsetMilliseconds,
        secondOnsetMilliseconds,
        endMilliseconds,
        firstDurationMilliseconds,
        secondDurationMilliseconds,
        ...classifySwing({
          measuredLongSubdivisionMs: firstDurationMilliseconds,
          measuredShortSubdivisionMs: secondDurationMilliseconds,
          callerStraightShareTolerance: input.straightShareTolerance,
        }),
      };
    });
    return toolSuccess(
      ensureOutput(
        { pairs, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const swingTimingDatasetExample = {
  input: {
    count: 2,
    ratios: [
      {
        first: 1,
        second: 1,
      },
      {
        first: 2,
        second: 1,
      },
      {
        first: 1,
        second: 2,
      },
    ],
    tempoBpm: {
      minimum: 120,
      maximum: 120,
    },
    startMilliseconds: 0,
    straightShareTolerance: 0.01,
    seed: 42,
  },
  output: {
    pairs: [
      {
        index: 0,
        ratioFirst: 2,
        ratioSecond: 1,
        beatsPerMinute: 120,
        beatMilliseconds: 500,
        firstOnsetMilliseconds: 0,
        secondOnsetMilliseconds: 333.3333333333333,
        endMilliseconds: 500,
        firstDurationMilliseconds: 333.3333333333333,
        secondDurationMilliseconds: 166.66666666666666,
        firstSubdivisionSharePercent: 66.66666666666666,
        longToShortSubdivisionRatio: 2,
        swingTimingClass: "long-short-swing",
      },
      {
        index: 1,
        ratioFirst: 1,
        ratioSecond: 2,
        beatsPerMinute: 120,
        beatMilliseconds: 500,
        firstOnsetMilliseconds: 500,
        secondOnsetMilliseconds: 666.6666666666666,
        endMilliseconds: 1000,
        firstDurationMilliseconds: 166.66666666666666,
        secondDurationMilliseconds: 333.3333333333333,
        firstSubdivisionSharePercent: 33.33333333333333,
        longToShortSubdivisionRatio: 0.5,
        swingTimingClass: "reverse-short-long",
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<SwingTimingDatasetInput, SwingTimingDatasetOutput>;
export const swingTimingDatasetTool = createModelDefinition<
  SwingTimingDatasetInput,
  SwingTimingDatasetOutput
>({
  id: "random/swing-timing-dataset",
  title: "Random Swing Timing Dataset Generator",
  description:
    "Generate synthetic paired-event timings from supplied ratios and tempos with delegated share and swing labels under caller tolerance.",
  inputSchema,
  outputSchema,
  execute: calculateSwingTimingDataset,
});
export const runSwingTimingDataset = swingTimingDatasetTool.execute;
export default swingTimingDatasetTool;
