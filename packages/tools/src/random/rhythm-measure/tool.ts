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
import { generatedMusicSeconds } from "../music-sequence-construction.js";
import { calculateTupletRatioDurationCalculator } from "../../music/tuplet-ratio-duration-calculator/tool.js";
import { SimpleToolError } from "../../core/simple.js";

export type RhythmNoteValue = {
  readonly denominator: number;
  readonly dots: number;
  readonly tupletActualNotes: number;
  readonly tupletNormalNotes: number;
};
export type RhythmMeasureInput = {
  readonly meterNumerator: number;
  readonly meterDenominator: number;
  readonly beatsPerMinute: number;
  readonly noteValues: readonly RhythmNoteValue[];
  readonly restProbability: number;
  readonly seed?: number;
};
export type RhythmMeasureOutput = {
  readonly divisionsPerQuarter: number;
  readonly totalTicks: number;
  readonly durationSeconds: number;
  readonly events: readonly {
    readonly tokenIndex: number;
    readonly startTick: number;
    readonly durationTicks: number;
    readonly quarterNoteMultiples: number;
    readonly durationSeconds: number;
    readonly startSeconds: number;
    readonly isRest: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const positiveTime = { type: "number", exclusiveMinimum: 0 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meterNumerator: { type: "integer", minimum: 1, maximum: 16 },
    meterDenominator: { type: "integer", enum: [1, 2, 4, 8, 16] },
    beatsPerMinute: positiveTime,
    noteValues: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer", enum: [1, 2, 4, 8, 16, 32, 64] },
          dots: { type: "integer", minimum: 0, maximum: 2 },
          tupletActualNotes: { type: "integer", minimum: 1, maximum: 16 },
          tupletNormalNotes: { type: "integer", minimum: 1, maximum: 16 },
        },
        required: [
          "denominator",
          "dots",
          "tupletActualNotes",
          "tupletNormalNotes",
        ],
      },
    },
    restProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: [
    "meterNumerator",
    "meterDenominator",
    "beatsPerMinute",
    "noteValues",
    "restProbability",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    divisionsPerQuarter: { type: "integer", minimum: 1, maximum: 4096 },
    totalTicks: { type: "integer", minimum: 1, maximum: 4096 },
    durationSeconds: positiveTime,
    events: {
      type: "array",
      minItems: 1,
      maxItems: 4096,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          tokenIndex: { type: "integer", minimum: 0, maximum: 15 },
          startTick: { type: "integer", minimum: 0, maximum: 4095 },
          durationTicks: { type: "integer", minimum: 1, maximum: 4096 },
          quarterNoteMultiples: positiveTime,
          durationSeconds: positiveTime,
          startSeconds: { type: "number", minimum: 0 },
          isRest: { type: "boolean" },
        },
        required: [
          "tokenIndex",
          "startTick",
          "durationTicks",
          "quarterNoteMultiples",
          "durationSeconds",
          "startSeconds",
          "isRest",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "divisionsPerQuarter",
    "totalTicks",
    "durationSeconds",
    "events",
    "randomness",
  ],
} as const;
type Fraction = { numerator: bigint; denominator: bigint };
const gcd = (a: bigint, b: bigint): bigint => {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
};
const fraction = (numerator: bigint, denominator: bigint): Fraction => {
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};
const isInput = (input: unknown): input is RhythmMeasureInput =>
  matchesModelInput(input, inputSchema);
export const calculateRhythmMeasure = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RhythmMeasureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const bar = fraction(
      BigInt(input.meterNumerator * 4),
      BigInt(input.meterDenominator),
    );
    const values = input.noteValues.map((note) =>
      fraction(
        BigInt(4 * (2 ** (note.dots + 1) - 1) * note.tupletNormalNotes),
        BigInt(note.denominator * 2 ** note.dots * note.tupletActualNotes),
      ),
    );
    let divisions = bar.denominator;
    for (const value of values)
      divisions =
        (divisions / gcd(divisions, value.denominator)) * value.denominator;
    const ticks = (bar.numerator * divisions) / bar.denominator;
    if (divisions > 4096n || ticks > 4096n)
      simpleError(
        "noteValues",
        "The exact grid and measure must each fit within 4,096 ticks.",
        "resource_limit",
      );
    const divisionsPerQuarter = Number(divisions),
      totalTicks = Number(ticks);
    const durations = values.map((value, tokenIndex) => {
      const note = input.noteValues[tokenIndex],
        normalQuarterMultiples =
          (4 / note.denominator) * (2 - 1 / 2 ** note.dots);
      const normalSeconds = generatedMusicSeconds(
        normalQuarterMultiples,
        input.beatsPerMinute,
      );
      let durationSeconds: number;
      try {
        durationSeconds = calculateTupletRatioDurationCalculator({
          normalNoteSeconds: normalSeconds,
          normalNotesInSpan: note.tupletNormalNotes,
          tupletNoteCount: note.tupletActualNotes,
        }).tupletNoteSeconds;
      } catch (error) {
        if (error instanceof SimpleToolError)
          return simpleError(
            "beatsPerMinute",
            "Tuplet seconds must remain finite and positive.",
            "numeric_overflow",
          );
        throw error;
      }
      if (!(durationSeconds > 0))
        simpleError(
          "beatsPerMinute",
          "Tuplet seconds must remain representable.",
          "numeric_overflow",
        );
      return {
        tokenIndex,
        durationTicks: Number(
          (value.numerator * divisions) / value.denominator,
        ),
        quarterNoteMultiples:
          Number(value.numerator) / Number(value.denominator),
        durationSeconds,
      };
    });
    const reachable = Array<boolean>(totalTicks + 1).fill(false);
    reachable[0] = true;
    for (let remaining = 1; remaining <= totalTicks; remaining += 1)
      reachable[remaining] = durations.some(
        (duration) =>
          duration.durationTicks <= remaining &&
          reachable[remaining - duration.durationTicks],
      );
    if (!reachable[totalTicks])
      simpleError(
        "noteValues",
        "The supplied durations cannot exactly fill the selected meter.",
        "unfillable_measure",
      );
    const random = createGeneratorRandom(input.seed, context),
      events: {
        tokenIndex: number;
        startTick: number;
        durationTicks: number;
        quarterNoteMultiples: number;
        durationSeconds: number;
        startSeconds: number;
        isRest: boolean;
      }[] = [];
    let startTick = 0;
    while (startTick < totalTicks) {
      const remaining = totalTicks - startTick,
        candidates = durations.filter(
          (duration) =>
            duration.durationTicks <= remaining &&
            reachable[remaining - duration.durationTicks],
        );
      const selected = random.pick(candidates),
        isRest = random.unit() < input.restProbability;
      events.push({
        ...selected,
        startTick,
        startSeconds: generatedMusicSeconds(
          startTick / divisionsPerQuarter,
          input.beatsPerMinute,
        ),
        isRest,
      });
      startTick += selected.durationTicks;
    }
    return toolSuccess({
      divisionsPerQuarter,
      totalTicks,
      durationSeconds: generatedMusicSeconds(
        (input.meterNumerator * 4) / input.meterDenominator,
        input.beatsPerMinute,
      ),
      events,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const rhythmMeasureExample = {
  input: {
    meterNumerator: 3,
    meterDenominator: 4,
    beatsPerMinute: 120,
    noteValues: [
      {
        denominator: 8,
        dots: 0,
        tupletActualNotes: 1,
        tupletNormalNotes: 1,
      },
      {
        denominator: 4,
        dots: 0,
        tupletActualNotes: 1,
        tupletNormalNotes: 1,
      },
    ],
    restProbability: 0.5,
    seed: 42,
  },
  output: {
    divisionsPerQuarter: 2,
    totalTicks: 6,
    durationSeconds: 1.5,
    events: [
      {
        durationTicks: 2,
        tokenIndex: 1,
        startTick: 0,
        quarterNoteMultiples: 1,
        durationSeconds: 0.5,
        startSeconds: 0,
        isRest: true,
      },
      {
        durationTicks: 2,
        tokenIndex: 1,
        startTick: 2,
        quarterNoteMultiples: 1,
        durationSeconds: 0.5,
        startSeconds: 0.5,
        isRest: false,
      },
      {
        durationTicks: 1,
        tokenIndex: 0,
        startTick: 4,
        quarterNoteMultiples: 0.5,
        durationSeconds: 0.25,
        startSeconds: 1,
        isRest: false,
      },
      {
        durationTicks: 1,
        tokenIndex: 0,
        startTick: 5,
        quarterNoteMultiples: 0.5,
        durationSeconds: 0.25,
        startSeconds: 1.25,
        isRest: false,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<RhythmMeasureInput, RhythmMeasureOutput>;
export const rhythmMeasureTool = createModelDefinition<
  RhythmMeasureInput,
  RhythmMeasureOutput
>({
  id: "random/rhythm-measure",
  title: "Random Exact-Fill Rhythm Measure Generator",
  description:
    "Fill one supplied meter exactly in a bounded rational tick grid with reachable duration choices and independent rests, delegating tempo and tuplet seconds; choices are locally uniform, not uniform over complete measures, and tuplet engraving groups are not inferred.",
  inputSchema,
  outputSchema,
  execute: calculateRhythmMeasure,
});
export const runRhythmMeasure = rhythmMeasureTool.execute;
export default rhythmMeasureTool;
