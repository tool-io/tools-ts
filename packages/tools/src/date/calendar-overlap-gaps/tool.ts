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
import { calculate as calculateIntervalCoverage } from "../../interval/interval-coverage-multiplicity/tool.js";

export type CalendarBusyInput = {
  readonly id: string;
  readonly intervals: readonly (readonly [number, number])[];
};
export type CalendarOverlapGapsInput = {
  readonly calendars: readonly CalendarBusyInput[];
  readonly windowStartEpochMs: number;
  readonly windowEndEpochMs: number;
};
export type CalendarSegment = {
  readonly startEpochMs: number;
  readonly endEpochMs: number;
  readonly durationMs: number;
  readonly activeCalendarIds: readonly string[];
};
export type CalendarOverlapGapsOutput = {
  readonly segments: readonly CalendarSegment[];
  readonly commonFree: readonly (readonly [number, number])[];
  readonly overlaps: readonly (readonly [number, number])[];
  readonly calendarBusyDurationMs: readonly {
    readonly id: string;
    readonly durationMs: number;
  }[];
};
const epochSchema = {
  description:
    "Absolute epoch milliseconds; timezone/recurrence normalization is caller-owned.",
  format: "timestamp/epoch-ms",
  type: "integer",
} as const;
const pairSchema = {
  items: { type: "integer" },
  minItems: 2,
  maxItems: 2,
  type: "array",
} as const;
const idSchema = { minLength: 1, maxLength: 64, type: "string" } as const;
export const inputSchema = {
  additionalProperties: false,
  properties: {
    calendars: {
      description:
        "Opaque busy intervals [start,end); at most 16 calendars and 127 total supplied intervals. Duplicate events within one calendar do not count as different calendars.",
      items: {
        additionalProperties: false,
        properties: {
          id: idSchema,
          intervals: { items: pairSchema, maxItems: 127, type: "array" },
        },
        required: ["id", "intervals"],
        type: "object",
      },
      maxItems: 16,
      type: "array",
    },
    windowStartEpochMs: epochSchema,
    windowEndEpochMs: epochSchema,
  },
  required: ["calendars", "windowStartEpochMs", "windowEndEpochMs"],
  type: "object",
} as const;
export const outputSchema = {
  additionalProperties: false,
  properties: {
    segments: {
      items: {
        additionalProperties: false,
        properties: {
          startEpochMs: epochSchema,
          endEpochMs: epochSchema,
          durationMs: { minimum: 1, type: "integer" },
          activeCalendarIds: { items: idSchema, maxItems: 16, type: "array" },
        },
        required: [
          "startEpochMs",
          "endEpochMs",
          "durationMs",
          "activeCalendarIds",
        ],
        type: "object",
      },
      maxItems: 255,
      minItems: 1,
      type: "array",
    },
    commonFree: { items: pairSchema, maxItems: 255, type: "array" },
    overlaps: { items: pairSchema, maxItems: 255, type: "array" },
    calendarBusyDurationMs: {
      items: {
        additionalProperties: false,
        properties: {
          id: idSchema,
          durationMs: { minimum: 0, type: "integer" },
        },
        required: ["id", "durationMs"],
        type: "object",
      },
      maxItems: 16,
      type: "array",
    },
  },
  required: ["segments", "commonFree", "overlaps", "calendarBusyDurationMs"],
  type: "object",
} as const;
const isInput = (input: unknown): input is CalendarOverlapGapsInput =>
  matchesModelInput(input, inputSchema);
type CoverageCell = {
  readonly start: number;
  readonly end: number;
  readonly sourceIndexes: readonly number[];
};
const isCells = (value: unknown): value is readonly CoverageCell[] =>
  matchesModelInput(value, {
    items: {
      additionalProperties: true,
      properties: {
        start: { type: "integer" },
        end: { type: "integer" },
        sourceIndexes: {
          items: { minimum: 0, maximum: 127, type: "integer" },
          maxItems: 128,
          type: "array",
        },
      },
      required: ["start", "end", "sourceIndexes"],
      type: "object",
    },
    maxItems: 255,
    type: "array",
  });
const sameIds = (a: readonly string[], b: readonly string[]): boolean =>
  a.length === b.length && a.every((value, i) => value === b[i]);

export const calculateCalendarOverlapGaps = (
  input: unknown,
): ToolResult<CalendarOverlapGapsOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  if (input.windowEndEpochMs <= input.windowStartEpochMs)
    return invalidInput([
      {
        code: "invalid_window",
        field: "windowEndEpochMs",
        message: "The comparison window must have a later end than start.",
      },
    ]);
  if (!Number.isSafeInteger(input.windowEndEpochMs - input.windowStartEpochMs))
    return invalidInput([
      {
        code: "unsafe_window",
        field: "windowEndEpochMs",
        message:
          "The window duration must fit a safe integer number of milliseconds.",
      },
    ]);
  const total = input.calendars.reduce(
    (sum, calendar) => sum + calendar.intervals.length,
    0,
  );
  if (total > 127)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "calendars",
        message: "Provide at most 127 total intervals across all calendars.",
      },
    ]);
  const ids = new Set<string>();
  const intervals: [number, number][] = [
    [input.windowStartEpochMs, input.windowEndEpochMs],
  ];
  const owners = [""];
  for (let i = 0; i < input.calendars.length; i += 1) {
    const calendar = input.calendars[i];
    if (ids.has(calendar.id))
      return invalidInput([
        {
          code: "duplicate_calendar_id",
          field: "calendars." + i + ".id",
          message: "Every calendar must have a unique exact ID.",
        },
      ]);
    ids.add(calendar.id);
    for (let j = 0; j < calendar.intervals.length; j += 1) {
      const [start, end] = calendar.intervals[j];
      if (end < start)
        return invalidInput([
          {
            code: "reversed_interval",
            field: "calendars." + i + ".intervals." + j,
            message: "An interval's end must not precede its start.",
          },
        ]);
      const clippedStart = Math.max(start, input.windowStartEpochMs),
        clippedEnd = Math.min(end, input.windowEndEpochMs);
      if (clippedEnd > clippedStart) {
        intervals.push([clippedStart, clippedEnd]);
        owners.push(calendar.id);
      }
    }
  }
  const cells = calculateIntervalCoverage({ intervals }).result.cells;
  if (!isCells(cells))
    throw new Error(
      "The existing coverage calculation returned an unexpected cell contract.",
    );
  const segments: {
    startEpochMs: number;
    endEpochMs: number;
    durationMs: number;
    activeCalendarIds: string[];
  }[] = [];
  for (const cell of cells) {
    if (cell.sourceIndexes.some((index) => index >= owners.length))
      throw new Error("A coverage cell references an unknown source interval.");
    const activeCalendarIds = [
      ...new Set(
        cell.sourceIndexes
          .filter((index) => index > 0)
          .map((index) => owners[index]),
      ),
    ].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const last = segments.at(-1);
    if (
      last &&
      last.endEpochMs === cell.start &&
      sameIds(last.activeCalendarIds, activeCalendarIds)
    ) {
      last.endEpochMs = cell.end;
      last.durationMs = last.endEpochMs - last.startEpochMs;
    } else
      segments.push({
        startEpochMs: cell.start,
        endEpochMs: cell.end,
        durationMs: cell.end - cell.start,
        activeCalendarIds,
      });
  }
  const collect = (
    predicate: (segment: CalendarSegment) => boolean,
  ): [number, number][] => {
    const result: [number, number][] = [];
    for (const segment of segments)
      if (predicate(segment)) {
        const last = result.at(-1);
        if (last && last[1] === segment.startEpochMs)
          last[1] = segment.endEpochMs;
        else result.push([segment.startEpochMs, segment.endEpochMs]);
      }
    return result;
  };
  const durations = new Map(
    input.calendars.map((calendar) => [calendar.id, 0]),
  );
  for (const segment of segments)
    for (const id of segment.activeCalendarIds)
      durations.set(id, (durations.get(id) ?? 0) + segment.durationMs);
  return toolSuccess({
    segments,
    commonFree: collect((segment) => segment.activeCalendarIds.length === 0),
    overlaps: collect((segment) => segment.activeCalendarIds.length >= 2),
    calendarBusyDurationMs: input.calendars.map((calendar) => ({
      id: calendar.id,
      durationMs: durations.get(calendar.id) ?? 0,
    })),
  });
};
export const calendarOverlapGapsExample = {
  input: {
    calendars: [
      {
        id: "alice",
        intervals: [
          [1792400400000, 1792404000000],
          [1792407600000, 1792411200000],
        ],
      },
      {
        id: "bob",
        intervals: [[1792402200000, 1792407600000]],
      },
    ],
    windowStartEpochMs: 1792400400000,
    windowEndEpochMs: 1792414800000,
  },
  output: {
    segments: [
      {
        startEpochMs: 1792400400000,
        endEpochMs: 1792402200000,
        durationMs: 1800000,
        activeCalendarIds: ["alice"],
      },
      {
        startEpochMs: 1792402200000,
        endEpochMs: 1792404000000,
        durationMs: 1800000,
        activeCalendarIds: ["alice", "bob"],
      },
      {
        startEpochMs: 1792404000000,
        endEpochMs: 1792407600000,
        durationMs: 3600000,
        activeCalendarIds: ["bob"],
      },
      {
        startEpochMs: 1792407600000,
        endEpochMs: 1792411200000,
        durationMs: 3600000,
        activeCalendarIds: ["alice"],
      },
      {
        startEpochMs: 1792411200000,
        endEpochMs: 1792414800000,
        durationMs: 3600000,
        activeCalendarIds: [],
      },
    ],
    commonFree: [[1792411200000, 1792414800000]],
    overlaps: [[1792402200000, 1792404000000]],
    calendarBusyDurationMs: [
      {
        id: "alice",
        durationMs: 7200000,
      },
      {
        id: "bob",
        durationMs: 5400000,
      },
    ],
  },
} satisfies ToolExample<CalendarOverlapGapsInput, CalendarOverlapGapsOutput>;
export const calendarOverlapGapsTool = createModelDefinition<
  CalendarOverlapGapsInput,
  CalendarOverlapGapsOutput
>({
  id: "date/calendar-overlap-gaps",
  title: "Calendar Overlap and Common Gap Finder",
  description:
    "Compare bounded supplied busy calendars over an explicit half-open epoch-millisecond window, deduplicating same-calendar overlap and delegating interval cells to report common gaps, overlaps and per-calendar occupied duration.",
  inputSchema,
  outputSchema,
  execute: calculateCalendarOverlapGaps,
});
export const runCalendarOverlapGaps = calendarOverlapGapsTool.execute;
export default calendarOverlapGapsTool;
