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
import { generatorSampleIndices } from "../generator-random.js";
import { calculateRandomDate } from "../date/tool.js";
import {
  generatedPlainDateSchema,
  generatedPlainDateAddDays,
  generatedPlainDateDifference,
  generatedPlainDateTimestamp,
} from "../calendar-day-construction.js";

export type CalendarEventSetInput = {
  readonly count: number;
  readonly startDate: string;
  readonly endDateExclusive: string;
  readonly minimumDurationDays: number;
  readonly maximumDurationDays: number;
  readonly overlapPolicy: "allowed" | "forbidden";
  readonly seed?: number;
};
export type CalendarEventSetOutput = {
  readonly events: readonly {
    readonly id: number;
    readonly startDate: string;
    readonly endDateExclusive: string;
    readonly durationDays: number;
  }[];
  readonly overlappingPairs: readonly (readonly [number, number])[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 128 },
    startDate: generatedPlainDateSchema,
    endDateExclusive: generatedPlainDateSchema,
    minimumDurationDays: { type: "integer", minimum: 1 },
    maximumDurationDays: { type: "integer", minimum: 1 },
    overlapPolicy: { type: "string", enum: ["allowed", "forbidden"] },
    seed: generatorSeedSchema,
  },
  required: [
    "count",
    "startDate",
    "endDateExclusive",
    "minimumDurationDays",
    "maximumDurationDays",
    "overlapPolicy",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "integer", minimum: 0, maximum: 127 },
          startDate: generatedPlainDateSchema,
          endDateExclusive: generatedPlainDateSchema,
          durationDays: { type: "integer", minimum: 1 },
        },
        required: ["id", "startDate", "endDateExclusive", "durationDays"],
      },
    },
    overlappingPairs: {
      type: "array",
      maxItems: 8128,
      items: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: { type: "integer", minimum: 0, maximum: 127 },
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["events", "overlappingPairs", "randomness"],
} as const;

const isInput = (input: unknown): input is CalendarEventSetInput =>
  matchesModelInput(input, inputSchema);
export const calculateCalendarEventSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CalendarEventSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const windowDays = generatedPlainDateDifference(
      input.startDate,
      input.endDateExclusive,
      "endDateExclusive",
    );
    if (windowDays <= 0)
      simpleError(
        "endDateExclusive",
        "The half-open event window must have positive length.",
        "empty_date_window",
      );
    if (input.maximumDurationDays < input.minimumDurationDays)
      simpleError(
        "maximumDurationDays",
        "Duration bounds must be ordered.",
        "invalid_duration_range",
      );
    const requiredDays =
      BigInt(input.minimumDurationDays) *
      BigInt(input.overlapPolicy === "forbidden" ? input.count : 1);
    if (requiredDays > BigInt(windowDays))
      simpleError(
        "count",
        "The selected minimum durations do not fit the window under this overlap policy.",
        "infeasible_event_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      durations: number[] = [];
    let remaining = windowDays;
    for (let i = 0; i < input.count; i += 1) {
      const available =
        input.overlapPolicy === "forbidden"
          ? remaining - (input.count - i - 1) * input.minimumDurationDays
          : windowDays;
      const duration = random.integer(
        input.minimumDurationDays,
        Math.min(input.maximumDurationDays, available),
      );
      durations.push(duration);
      if (input.overlapPolicy === "forbidden") remaining -= duration;
    }
    const offsets: number[] = [];
    if (input.overlapPolicy === "forbidden") {
      const tokens = remaining + input.count,
        cuts = generatorSampleIndices(tokens, input.count, random)
          .map((index) => index + 1)
          .sort((a, b) => a - b);
      const gaps = cuts.map((cut, i) => cut - (i ? cuts[i - 1] : 0) - 1);
      gaps.push(tokens - cuts[cuts.length - 1]);
      let cursor = gaps[0];
      durations.forEach((duration, i) => {
        offsets.push(cursor);
        cursor += duration + gaps[i + 1];
      });
      if (cursor !== windowDays)
        throw new Error(
          "Calendar gap composition did not conserve the window.",
        );
    } else
      for (const duration of durations) {
        const lastStart = generatedPlainDateAddDays(
          input.endDateExclusive,
          -duration,
          "maximumDurationDays",
        );
        const selected = calculateRandomDate(
          input.startDate,
          lastStart,
          random.unit,
        );
        if (selected === null)
          throw new Error(
            "Validated event start bounds were rejected by the random-date core.",
          );
        offsets.push(
          generatedPlainDateDifference(input.startDate, selected, "startDate"),
        );
      }
    const events = durations.map((durationDays, id) => {
      const startDate = generatedPlainDateAddDays(
        input.startDate,
        offsets[id],
        "startDate",
      );
      const endDateExclusive = generatedPlainDateAddDays(
        startDate,
        durationDays,
        "maximumDurationDays",
      );
      if (
        generatedPlainDateDifference(
          startDate,
          endDateExclusive,
          "maximumDurationDays",
        ) !== durationDays
      )
        throw new Error(
          "Generated calendar duration failed the date-core cross-check.",
        );
      return { id, startDate, endDateExclusive, durationDays };
    });
    const intervals = events.map((event) => [
      generatedPlainDateTimestamp(event.startDate, "startDate"),
      generatedPlainDateTimestamp(event.endDateExclusive, "endDateExclusive"),
    ]);
    const overlappingPairs: [number, number][] = [];
    for (let i = 0; i < intervals.length; i += 1)
      for (let j = i + 1; j < intervals.length; j += 1)
        if (
          intervals[i][0] < intervals[j][1] &&
          intervals[j][0] < intervals[i][1]
        )
          overlappingPairs.push([i, j]);
    if (input.overlapPolicy === "forbidden" && overlappingPairs.length)
      throw new Error("Gap construction produced overlapping calendar events.");
    return toolSuccess({
      events,
      overlappingPairs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const calendarEventSetExample = {
  input: {
    count: 3,
    startDate: "2026-10-01",
    endDateExclusive: "2026-10-15",
    minimumDurationDays: 1,
    maximumDurationDays: 4,
    overlapPolicy: "forbidden",
    seed: 42,
  },
  output: {
    events: [
      {
        id: 0,
        startDate: "2026-10-02",
        endDateExclusive: "2026-10-05",
        durationDays: 3,
      },
      {
        id: 1,
        startDate: "2026-10-06",
        endDateExclusive: "2026-10-08",
        durationDays: 2,
      },
      {
        id: 2,
        startDate: "2026-10-09",
        endDateExclusive: "2026-10-13",
        durationDays: 4,
      },
    ],
    overlappingPairs: [],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CalendarEventSetInput, CalendarEventSetOutput>;
export const calendarEventSetTool = createModelDefinition<
  CalendarEventSetInput,
  CalendarEventSetOutput
>({
  id: "random/calendar-event-set",
  title: "Random Calendar Event Set Generator",
  description:
    "Generate exact-count date-only half-open events inside a supplied window, choosing feasible bounded durations sequentially and optionally distributing nonnegative gaps without overlaps; allowed-overlap mode uses the existing random date core, not a uniform draw over all event sets.",
  inputSchema,
  outputSchema,
  execute: calculateCalendarEventSet,
});
export const runCalendarEventSet = calendarEventSetTool.execute;
export default calendarEventSetTool;
