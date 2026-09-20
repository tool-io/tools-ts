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
import { calculateRecurrenceRule } from "../../date/recurrence-rule/tool.js";
import { calculateRandomDate } from "../date/tool.js";
import {
  generatedPlainDateSchema,
  generatedPlainDateTimestamp,
  generatedPlainDateAddDays,
} from "../calendar-day-construction.js";

export type RecurrenceScheduleInput = {
  readonly scheduleCount: number;
  readonly minimumStartDate: string;
  readonly maximumStartDate: string;
  readonly frequencies: readonly ("daily" | "weekly" | "monthly" | "yearly")[];
  readonly minimumInterval: number;
  readonly maximumInterval: number;
  readonly minimumOccurrences: number;
  readonly maximumOccurrences: number;
  readonly seed?: number;
};
export type RecurrenceScheduleOutput = {
  readonly schedules: readonly {
    readonly startDate: string;
    readonly frequency: "daily" | "weekly" | "monthly" | "yearly";
    readonly interval: number;
    readonly occurrences: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const frequencySchema = {
  type: "string",
  enum: ["daily", "weekly", "monthly", "yearly"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduleCount: { type: "integer", minimum: 1, maximum: 32 },
    minimumStartDate: generatedPlainDateSchema,
    maximumStartDate: generatedPlainDateSchema,
    frequencies: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: frequencySchema,
    },
    minimumInterval: { type: "integer", minimum: 1, maximum: 1000 },
    maximumInterval: { type: "integer", minimum: 1, maximum: 1000 },
    minimumOccurrences: { type: "integer", minimum: 1, maximum: 52 },
    maximumOccurrences: { type: "integer", minimum: 1, maximum: 52 },
    seed: generatorSeedSchema,
  },
  required: [
    "scheduleCount",
    "minimumStartDate",
    "maximumStartDate",
    "frequencies",
    "minimumInterval",
    "maximumInterval",
    "minimumOccurrences",
    "maximumOccurrences",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    schedules: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          startDate: generatedPlainDateSchema,
          frequency: frequencySchema,
          interval: { type: "integer", minimum: 1, maximum: 1000 },
          occurrences: {
            type: "array",
            minItems: 1,
            maxItems: 52,
            items: generatedPlainDateSchema,
          },
        },
        required: ["startDate", "frequency", "interval", "occurrences"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["schedules", "randomness"],
} as const;
const nextOccurrence = (
  date: string,
  frequency: RecurrenceScheduleInput["frequencies"][number],
  interval: number,
): string => {
  const year = Number(date.slice(0, 4)),
    shifted = year < 100;
  const coreDate = shifted
    ? String(year + 400).padStart(4, "0") + date.slice(4)
    : date;
  const next = calculateRecurrenceRule({
    startDate: coreDate,
    frequency,
    interval,
    count: 2,
  }).occurrences[1];
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}(?![\s\S])/.test(next))
    return simpleError(
      "maximumInterval",
      "Generated occurrences must remain within years 0000–9999.",
      "date_range_exceeded",
    );
  const mapped = shifted
    ? String(Number(next.slice(0, 4)) - 400).padStart(4, "0") + next.slice(4)
    : next;
  return generatedPlainDateAddDays(mapped, 0, "maximumInterval");
};
const isInput = (input: unknown): input is RecurrenceScheduleInput =>
  matchesModelInput(input, inputSchema);
export const calculateRecurrenceSchedule = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RecurrenceScheduleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.frequencies).size !== input.frequencies.length)
      simpleError(
        "frequencies",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    const first = generatedPlainDateTimestamp(
        input.minimumStartDate,
        "minimumStartDate",
      ),
      last = generatedPlainDateTimestamp(
        input.maximumStartDate,
        "maximumStartDate",
      );
    if (first > last)
      simpleError(
        "maximumStartDate",
        "Start-date bounds must be ordered.",
        "invalid_date_range",
      );
    if (input.minimumInterval > input.maximumInterval)
      simpleError(
        "maximumInterval",
        "Interval bounds must be ordered.",
        "invalid_interval_range",
      );
    if (input.minimumOccurrences > input.maximumOccurrences)
      simpleError(
        "maximumOccurrences",
        "Occurrence-count bounds must be ordered.",
        "invalid_occurrence_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    const schedules = Array.from({ length: input.scheduleCount }, () => {
      const startDate = calculateRandomDate(
        input.minimumStartDate,
        input.maximumStartDate,
        random.unit,
      );
      if (startDate === null)
        throw new Error(
          "Validated start-date bounds were rejected by the random-date core.",
        );
      const frequency = random.pick(input.frequencies),
        interval = random.integer(input.minimumInterval, input.maximumInterval),
        count = random.integer(
          input.minimumOccurrences,
          input.maximumOccurrences,
        );
      const occurrences = [startDate];
      while (occurrences.length < count)
        occurrences.push(
          nextOccurrence(
            occurrences[occurrences.length - 1],
            frequency,
            interval,
          ),
        );
      return { startDate, frequency, interval, occurrences };
    });
    return toolSuccess({
      schedules,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const recurrenceScheduleExample = {
  input: {
    scheduleCount: 2,
    minimumStartDate: "2024-01-28",
    maximumStartDate: "2024-01-31",
    frequencies: ["monthly", "weekly"],
    minimumInterval: 1,
    maximumInterval: 2,
    minimumOccurrences: 3,
    maximumOccurrences: 4,
    seed: 42,
  },
  output: {
    schedules: [
      {
        startDate: "2024-01-30",
        frequency: "monthly",
        interval: 2,
        occurrences: ["2024-01-30", "2024-03-30", "2024-05-30", "2024-07-30"],
      },
      {
        startDate: "2024-01-28",
        frequency: "weekly",
        interval: 1,
        occurrences: ["2024-01-28", "2024-02-04", "2024-02-11", "2024-02-18"],
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<RecurrenceScheduleInput, RecurrenceScheduleOutput>;
export const recurrenceScheduleTool = createModelDefinition<
  RecurrenceScheduleInput,
  RecurrenceScheduleOutput
>({
  id: "random/recurrence-schedule",
  title: "Random Recurrence Schedule Generator",
  description:
    "Generate seeded daily, weekly, monthly, or yearly date-only schedules from bounded start, interval, and occurrence choices; reuse sequential calendar clamping (Jan 31 to Feb 29 to Mar 29), not full RFC 5545 recurrence rules.",
  inputSchema,
  outputSchema,
  execute: calculateRecurrenceSchedule,
});
export const runRecurrenceSchedule = recurrenceScheduleTool.execute;
export default recurrenceScheduleTool;
