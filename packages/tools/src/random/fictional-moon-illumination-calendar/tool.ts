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
import { calculate as illumination } from "../../astronomy/lunar-phase-illumination-percent/tool.js";
import {
  generatedPlainDateTimestamp,
  generatedPlainDateAddDays,
  generatedPlainDateSchema,
} from "../calendar-day-construction.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  rangeSchema,
  drawReal,
  orderedRange,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type FictionalMoonIlluminationCalendarInput = {
  readonly startDate: string;
  readonly count: number;
  readonly stepDays: number;
  readonly initialPhaseDegrees: NumericRange;
  readonly cycleDays: NumericRange;
  readonly seed?: number;
};
export type FictionalMoonIlluminationCalendarOutput = {
  readonly initialPhaseDegrees: number;
  readonly cycleDays: number;
  readonly dates: readonly {
    readonly date: string;
    readonly dayOffset: number;
    readonly orientedPhaseDegrees: number;
    readonly elongationDegrees: number;
    readonly direction: "waxing" | "waning" | "turning";
    readonly illuminationPercent: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    startDate: generatedPlainDateSchema,
    count: countSchema(128),
    stepDays: { type: "integer", minimum: 1 },
    initialPhaseDegrees: rangeSchema({
      type: "number",
      minimum: 0,
      maximum: 360,
    }),
    cycleDays: rangeSchema(positiveSchema),
    seed: generatorSeedSchema,
  },
  ["startDate", "count", "stepDays", "initialPhaseDegrees", "cycleDays"],
);
export const outputSchema = objectSchema({
  initialPhaseDegrees: { type: "number", minimum: 0, exclusiveMaximum: 360 },
  cycleDays: positiveSchema,
  dates: arraySchema(
    objectSchema({
      date: generatedPlainDateSchema,
      dayOffset: { type: "integer", minimum: 0 },
      orientedPhaseDegrees: {
        type: "number",
        minimum: 0,
        exclusiveMaximum: 360,
      },
      elongationDegrees: { type: "number", minimum: 0, maximum: 180 },
      direction: { type: "string", enum: ["waxing", "waning", "turning"] },
      illuminationPercent: { type: "number", minimum: 0, maximum: 100 },
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is FictionalMoonIlluminationCalendarInput =>
  matchesModelInput(value, inputSchema);
export const calculateFictionalMoonIlluminationCalendar = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FictionalMoonIlluminationCalendarOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.initialPhaseDegrees, "initialPhaseDegrees");
    orderedRange(input.cycleDays, "cycleDays");
    generatedPlainDateTimestamp(input.startDate, "startDate");
    const lastOffset = BigInt(input.count - 1) * BigInt(input.stepDays);
    if (lastOffset > BigInt(Number.MAX_SAFE_INTEGER))
      simpleError(
        "stepDays",
        "Date offsets exceed safe integer precision.",
        "date_range_exceeded",
      );
    generatedPlainDateAddDays(input.startDate, Number(lastOffset), "stepDays");
    const random = createGeneratorRandom(input.seed, context),
      initialPhaseDegrees =
        drawReal(input.initialPhaseDegrees, random, "initialPhaseDegrees") %
        360,
      cycleDays = drawReal(input.cycleDays, random, "cycleDays");
    const dates = Array.from({ length: input.count }, (_, i) => {
      const dayOffset = i * input.stepDays,
        orientedPhaseDegrees =
          (initialPhaseDegrees + 360 * ((dayOffset % cycleDays) / cycleDays)) %
          360,
        elongationDegrees = Math.min(
          orientedPhaseDegrees,
          360 - orientedPhaseDegrees,
        );
      const direction: FictionalMoonIlluminationCalendarOutput["dates"][number]["direction"] =
        orientedPhaseDegrees === 0 || orientedPhaseDegrees === 180
          ? "turning"
          : orientedPhaseDegrees < 180
            ? "waxing"
            : "waning";
      const illuminationPercent = illumination({
        observedSunMoonElongationDegrees: elongationDegrees,
      }).distantSunLunarIlluminationPercent;
      return {
        date: generatedPlainDateAddDays(input.startDate, dayOffset, "stepDays"),
        dayOffset,
        orientedPhaseDegrees,
        elongationDegrees,
        direction,
        illuminationPercent,
      };
    });
    return toolSuccess(
      ensureOutput(
        {
          initialPhaseDegrees,
          cycleDays,
          dates,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fictionalMoonIlluminationCalendarExample = {
  input: {
    startDate: "2024-02-01",
    count: 5,
    stepDays: 7,
    initialPhaseDegrees: {
      minimum: 0,
      maximum: 0,
    },
    cycleDays: {
      minimum: 28,
      maximum: 28,
    },
    seed: 42,
  },
  output: {
    initialPhaseDegrees: 0,
    cycleDays: 28,
    dates: [
      {
        date: "2024-02-01",
        dayOffset: 0,
        orientedPhaseDegrees: 0,
        elongationDegrees: 0,
        direction: "turning",
        illuminationPercent: 0,
      },
      {
        date: "2024-02-08",
        dayOffset: 7,
        orientedPhaseDegrees: 90,
        elongationDegrees: 90,
        direction: "waxing",
        illuminationPercent: 49.99999999999999,
      },
      {
        date: "2024-02-15",
        dayOffset: 14,
        orientedPhaseDegrees: 180,
        elongationDegrees: 180,
        direction: "turning",
        illuminationPercent: 100,
      },
      {
        date: "2024-02-22",
        dayOffset: 21,
        orientedPhaseDegrees: 270,
        elongationDegrees: 90,
        direction: "waning",
        illuminationPercent: 49.99999999999999,
      },
      {
        date: "2024-02-29",
        dayOffset: 28,
        orientedPhaseDegrees: 0,
        elongationDegrees: 0,
        direction: "turning",
        illuminationPercent: 0,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  FictionalMoonIlluminationCalendarInput,
  FictionalMoonIlluminationCalendarOutput
>;
export const fictionalMoonIlluminationCalendarTool = createModelDefinition<
  FictionalMoonIlluminationCalendarInput,
  FictionalMoonIlluminationCalendarOutput
>({
  id: "random/fictional-moon-illumination-calendar",
  title: "Random Fictional Moon Illumination Calendar Generator",
  description:
    "Generate dated fictional moon illumination from a sampled initial oriented phase and fixed cycle, folding elongation for the distant-Sun core.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalMoonIlluminationCalendar,
});
export const runFictionalMoonIlluminationCalendar =
  fictionalMoonIlluminationCalendarTool.execute;
export default fictionalMoonIlluminationCalendarTool;
