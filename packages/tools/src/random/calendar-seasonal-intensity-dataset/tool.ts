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
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { parsePlainDate } from "../../core/date.js";
import { runAddDays } from "../../date/add-days/tool.js";
import { runIsoWeekday } from "../../date/iso-weekday/tool.js";

export type CalendarSeasonalIntensityDatasetInput = {
  readonly startDate: string;
  readonly count: number;
  readonly pattern: "weekly" | "periodic";
  readonly offsets: readonly number[];
  readonly baseline: number;
  readonly noise: number;
  readonly seed?: number;
};
export type CalendarSeasonalIntensityDatasetOutput = {
  readonly days: readonly {
    readonly date: string;
    readonly weekday: number;
    readonly baseline: number;
    readonly seasonal: number;
    readonly noise: number;
    readonly intensity: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    startDate: {
      type: "string",
      pattern:
        "^(?:0[1-9][0-9]{2}|[1-9][0-9]{3})-[0-9]{2}-[0-9]{2}(?![\\s\\S])",
      minLength: 10,
      maxLength: 10,
    },
    count: { type: "integer", minimum: 1, maximum: 128 },
    pattern: { type: "string", enum: ["weekly", "periodic"] },
    offsets: array({ type: "integer", minimum: 0 }, 32, 1),
    baseline: { type: "integer", minimum: 0 },
    noise: { type: "integer", minimum: 0, maximum: 1000000 },
    seed: generatorSeedSchema,
  },
  ["startDate", "count", "pattern", "offsets", "baseline", "noise"],
);
export const outputSchema = object({
  days: array(
    object({
      date: { type: "string", minLength: 10, maxLength: 10 },
      weekday: { type: "integer", minimum: 1, maximum: 7 },
      baseline: integer,
      seasonal: integer,
      noise: integer,
      intensity: integer,
    }),
    128,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  value: unknown,
): value is CalendarSeasonalIntensityDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateCalendarSeasonalIntensityDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CalendarSeasonalIntensityDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.pattern === "weekly" && input.offsets.length !== 7)
      simpleError(
        "offsets",
        "Weekly patterns require seven Monday-first offsets.",
        "shape_mismatch",
      );
    const timestamp = parsePlainDate(input.startDate, "startDate");
    if (timestamp + (input.count - 1) * 86400000 > 253402214400000)
      simpleError("count", "Dates exceed year 9999.", "date_overflow");
    for (const o of input.offsets)
      safe(input.baseline + o + input.noise, "baseline");
    const days = Array.from({ length: input.count }, (_, i) => {
      const date = core(runAddDays({ date: input.startDate, days: i })).date,
        weekday = core(runIsoWeekday({ date })).weekday,
        seasonal =
          input.offsets[
            input.pattern === "weekly" ? weekday - 1 : i % input.offsets.length
          ],
        noise = random.integer(0, input.noise);
      return {
        date,
        weekday,
        baseline: input.baseline,
        seasonal,
        noise,
        intensity: safe(input.baseline + seasonal + noise),
      };
    });
    const result = { days };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const calendarSeasonalIntensityDatasetExample = {
  input: {
    startDate: "2026-10-19",
    count: 2,
    pattern: "weekly",
    offsets: [2, 0, 0, 0, 0, 0, 0],
    baseline: 3,
    noise: 1,
    seed: 42,
  },
  output: {
    days: [
      {
        date: "2026-10-19",
        weekday: 1,
        baseline: 3,
        seasonal: 2,
        noise: 1,
        intensity: 6,
      },
      {
        date: "2026-10-20",
        weekday: 2,
        baseline: 3,
        seasonal: 0,
        noise: 0,
        intensity: 3,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CalendarSeasonalIntensityDatasetInput,
  CalendarSeasonalIntensityDatasetOutput
>;
export const calendarSeasonalIntensityDatasetTool = createModelDefinition<
  CalendarSeasonalIntensityDatasetInput,
  CalendarSeasonalIntensityDatasetOutput
>({
  id: "random/calendar-seasonal-intensity-dataset",
  title: "Random Calendar Seasonal Intensity Dataset Generator",
  description:
    "Generate date-specific synthetic intensity ledgers from explicit weekly or periodic offsets, baseline and nonnegative integer noise.",
  inputSchema,
  outputSchema,
  execute: calculateCalendarSeasonalIntensityDataset,
});
export const runCalendarSeasonalIntensityDataset =
  calendarSeasonalIntensityDatasetTool.execute;
export default calendarSeasonalIntensityDatasetTool;
