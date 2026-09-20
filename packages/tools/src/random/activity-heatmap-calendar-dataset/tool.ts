import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { runIsoWeekday } from "../../date/iso-weekday/tool.js";
import { runYearCalendar } from "../../date/year-calendar/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksInteger,
  mocksDate,
  mocksOrdered,
  mocksSafe,
  mocksCore,
  mocksAddDays,
  mocksDays,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type ActivityHeatmapCalendarDatasetInput = {
  readonly startDate: string;
  readonly endDateExclusive: string;
  readonly weekdayRanges: readonly {
    readonly minimum: number;
    readonly maximum: number;
  }[];
  readonly seed?: number;
};
export type ActivityHeatmapCalendarDatasetOutput = {
  readonly days: readonly {
    readonly date: string;
    readonly isoWeekday: number;
    readonly month: number;
    readonly weekOfMonth: number;
    readonly count: number;
  }[];
  readonly totalCount: number;
  readonly activeDays: number;
  readonly maximumCount: number;
  readonly randomness: GeneratorReplay;
};
const nonnegative = { type: "integer", minimum: 0 } as const;
export const inputSchema = mocksObject(
  {
    startDate: mocksDate,
    endDateExclusive: mocksDate,
    weekdayRanges: mocksArray(
      mocksObject({ minimum: nonnegative, maximum: nonnegative }),
      7,
      7,
    ),
    seed: generatorSeedSchema,
  },
  ["startDate", "endDateExclusive", "weekdayRanges"],
);
export const outputSchema = mocksObject({
  days: mocksArray(
    mocksObject({
      date: mocksDate,
      isoWeekday: { type: "integer", minimum: 1, maximum: 7 },
      month: { type: "integer", minimum: 1, maximum: 12 },
      weekOfMonth: { type: "integer", minimum: 1, maximum: 6 },
      count: nonnegative,
    }),
    366,
    1,
  ),
  totalCount: nonnegative,
  activeDays: mocksInteger,
  maximumCount: nonnegative,
  randomness: generatorReplaySchema,
});
const generate = (
  input: ActivityHeatmapCalendarDatasetInput,
  random: GeneratorRandom,
): Omit<ActivityHeatmapCalendarDatasetOutput, "randomness"> => {
  const length = mocksDays(input.startDate, input.endDateExclusive);
  if (length < 1)
    simpleError(
      "endDateExclusive",
      "The activity interval must be nonempty.",
      "empty_date_window",
    );
  if (length > 366)
    simpleError(
      "endDateExclusive",
      "At most 366 calendar days can be materialized.",
      "resource_limit_exceeded",
    );
  for (const range of input.weekdayRanges) {
    mocksOrdered(range.minimum, range.maximum, "weekdayRanges");
    mocksSafe(range.maximum - range.minimum + 1, "weekdayRanges");
  }
  const years = [
    ...new Set([
      Number(input.startDate.slice(0, 4)),
      Number(mocksAddDays(input.endDateExclusive, -1).slice(0, 4)),
    ]),
  ];
  const calendars = new Map(
    years.map((year) => [
      year,
      mocksCore(runYearCalendar({ year, currentWeekDate: "" }), "startDate")
        .months,
    ]),
  );
  const days = Array.from({ length }, (_, offset) => {
    const date = mocksAddDays(input.startDate, offset),
      year = Number(date.slice(0, 4)),
      month = Number(date.slice(5, 7)),
      day = Number(date.slice(8, 10));
    const isoWeekday = mocksCore(runIsoWeekday({ date }), "startDate").weekday;
    const calendar = calendars.get(year),
      monthGrid = calendar?.months.find((item) => item.month === month);
    if (!monthGrid) throw new Error("Year calendar omitted a generated month.");
    const weekOfMonth =
      monthGrid.weeks.findIndex((week) => week.dates.includes(day)) + 1;
    if (
      weekOfMonth < 1 ||
      monthGrid.weeks[weekOfMonth - 1].dates[isoWeekday - 1] !== day
    )
      throw new Error("ISO weekday and year calendar positions disagree.");
    const range = input.weekdayRanges[isoWeekday - 1],
      count = random.integer(range.minimum, range.maximum);
    return { date, isoWeekday, month, weekOfMonth, count };
  });
  return {
    days,
    totalCount: mocksSafe(
      days.reduce((sum, day) => sum + day.count, 0),
      "weekdayRanges",
    ),
    activeDays: days.filter((day) => day.count > 0).length,
    maximumCount: Math.max(...days.map((day) => day.count)),
  };
};
export const activityHeatmapCalendarDatasetExample = {
  input: {
    startDate: "2024-02-28",
    endDateExclusive: "2024-03-02",
    weekdayRanges: [
      { minimum: 0, maximum: 2 },
      { minimum: 1, maximum: 3 },
      { minimum: 2, maximum: 4 },
      { minimum: 0, maximum: 1 },
      { minimum: 4, maximum: 6 },
      { minimum: 0, maximum: 0 },
      { minimum: 0, maximum: 0 },
    ],
    seed: 42,
  },
  output: {
    days: [
      { date: "2024-02-28", isoWeekday: 3, month: 2, weekOfMonth: 5, count: 3 },
      { date: "2024-02-29", isoWeekday: 4, month: 2, weekOfMonth: 5, count: 0 },
      { date: "2024-03-01", isoWeekday: 5, month: 3, weekOfMonth: 1, count: 6 },
    ],
    totalCount: 9,
    activeDays: 2,
    maximumCount: 6,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  ActivityHeatmapCalendarDatasetInput,
  ActivityHeatmapCalendarDatasetOutput
>;

const isInput = (
  input: unknown,
): input is ActivityHeatmapCalendarDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateActivityHeatmapCalendarDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ActivityHeatmapCalendarDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const activityHeatmapCalendarDatasetTool = createModelDefinition<
  ActivityHeatmapCalendarDatasetInput,
  ActivityHeatmapCalendarDatasetOutput
>({
  id: "random/activity-heatmap-calendar-dataset",
  title: "Random Activity Heatmap Calendar Dataset Generator",
  description:
    "Populate an explicit half-open calendar interval with synthetic counts from supplied ISO-weekday ranges and calendar positions without choosing display bins or colors.",
  inputSchema,
  outputSchema,
  execute: calculateActivityHeatmapCalendarDataset,
});
export const runActivityHeatmapCalendarDataset =
  activityHeatmapCalendarDatasetTool.execute;
export default activityHeatmapCalendarDatasetTool;
