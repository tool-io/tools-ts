import { parsePlainDate } from "../../core/date.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

const weekdayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type WeekdayName = (typeof weekdayNames)[number];

export type JournalEntryDateFlagInput = {
  readonly entries: ReadonlyArray<{ readonly date: string }>;
  readonly holidays: ReadonlyArray<string>;
  readonly weekend: ReadonlyArray<WeekdayName>;
};

export type JournalEntryDateFlagOutput = {
  readonly flagged: ReadonlyArray<{
    readonly index: number;
    readonly reason: "holiday" | "weekend";
  }>;
  readonly flaggedCount: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isWeekdayName = (value: string): value is WeekdayName =>
  weekdayNames.some((weekday) => weekday === value);

const parseWeekday = (value: string, field: string): number => {
  const day = weekdayNames.findIndex((weekday) => weekday === value);
  if (day < 0)
    simpleError(
      field,
      "Weekend days must be lowercase English weekday names such as saturday or sunday.",
      "invalid_weekday",
    );
  return day;
};

const parseJournalDate = (
  value: string,
  field: string,
  code: string,
): number => {
  try {
    return parsePlainDate(value, field);
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(field, error.message, code);
    throw error;
  }
};

export const flagJournalEntryDates = (
  input: JournalEntryDateFlagInput,
): JournalEntryDateFlagOutput => {
  if (!Array.isArray(input.entries))
    simpleError("entries", "Entries must be an array.", "entries_required");
  if (!Array.isArray(input.holidays))
    simpleError("holidays", "Holidays must be an array.", "holidays_required");
  if (!Array.isArray(input.weekend))
    simpleError(
      "weekend",
      "Weekend days must be an array.",
      "weekend_required",
    );
  for (const [field, values] of [
    ["entries", input.entries],
    ["holidays", input.holidays],
    ["weekend", input.weekend],
  ] as const)
    if (values.length > toolResourceLimits.generatedValues)
      simpleError(
        field,
        `${field} must not contain more than ${toolResourceLimits.generatedValues} entries.`,
        "resource_limit_exceeded",
      );

  const holidayTimestamps = new Set(
    input.holidays.map((holiday, index) =>
      parseJournalDate(holiday, `holidays.${index}`, "invalid_holiday_date"),
    ),
  );
  const weekendDays = new Set(
    input.weekend.map((day, index) => parseWeekday(day, `weekend.${index}`)),
  );
  const flagged: { index: number; reason: "holiday" | "weekend" }[] = [];
  for (const [index, entry] of input.entries.entries()) {
    if (typeof entry?.date !== "string")
      simpleError(
        `entries.${index}.date`,
        "Each journal entry must have a posting date.",
        "invalid_entry_date",
      );
    const timestamp = parseJournalDate(
      entry.date,
      `entries.${index}.date`,
      "invalid_entry_date",
    );
    const weekday = new Date(timestamp).getUTCDay();
    if (holidayTimestamps.has(timestamp))
      flagged.push({ index, reason: "holiday" });
    else if (weekendDays.has(weekday))
      flagged.push({ index, reason: "weekend" });
  }
  return { flagged, flaggedCount: flagged.length };
};

export const journalEntryDateFlagExample = {
  input: {
    entries: [
      { date: "2026-01-01" },
      { date: "2026-01-03" },
      { date: "2026-01-05" },
    ],
    holidays: ["2026-01-01"],
    weekend: ["saturday", "sunday"],
  },
  output: {
    flagged: [
      { index: 0, reason: "holiday" },
      { index: 1, reason: "weekend" },
    ],
    flaggedCount: 2,
  },
} satisfies ToolExample<JournalEntryDateFlagInput, JournalEntryDateFlagOutput>;

const executeJournalEntryDateFlag = (
  input: unknown,
): ToolResult<JournalEntryDateFlagOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const unknownField = Object.keys(input).find(
    (field) =>
      field !== "entries" && field !== "holidays" && field !== "weekend",
  );
  if (unknownField !== undefined)
    return invalidInput([
      {
        code: "unknown_field",
        field: unknownField,
        message: `${unknownField} is not a supported input field.`,
      },
    ]);
  if (!Array.isArray(input.entries))
    return invalidInput([
      {
        code: "entries_required",
        field: "entries",
        message: "Entries must be an array.",
      },
    ]);
  if (!Array.isArray(input.holidays))
    return invalidInput([
      {
        code: "holidays_required",
        field: "holidays",
        message: "Holidays must be an array.",
      },
    ]);
  if (!Array.isArray(input.weekend))
    return invalidInput([
      {
        code: "weekend_required",
        field: "weekend",
        message: "Weekend days must be an array.",
      },
    ]);
  for (const [field, values] of [
    ["entries", input.entries],
    ["holidays", input.holidays],
    ["weekend", input.weekend],
  ] as const)
    if (values.length > toolResourceLimits.generatedValues)
      return invalidInput([
        {
          code: "resource_limit_exceeded",
          field,
          message: `${field} must not contain more than ${toolResourceLimits.generatedValues} entries.`,
        },
      ]);

  const entries: { date: string }[] = [];
  for (const [index, entry] of input.entries.entries()) {
    if (!isRecord(entry))
      return invalidInput([
        {
          code: "invalid_entry",
          field: `entries.${index}`,
          message: "Each journal entry must be an object.",
        },
      ]);
    const unknownEntryField = Object.keys(entry).find(
      (field) => field !== "date",
    );
    if (unknownEntryField !== undefined)
      return invalidInput([
        {
          code: "unknown_field",
          field: `entries.${index}.${unknownEntryField}`,
          message: `${unknownEntryField} is not a supported journal-entry field.`,
        },
      ]);
    if (typeof entry.date !== "string")
      return invalidInput([
        {
          code: "invalid_entry_date",
          field: `entries.${index}.date`,
          message: "Each journal entry must have a posting date.",
        },
      ]);
    entries.push({ date: entry.date });
  }
  const holidays: string[] = [];
  for (const [index, holiday] of input.holidays.entries()) {
    if (typeof holiday !== "string")
      return invalidInput([
        {
          code: "invalid_holiday_date",
          field: `holidays.${index}`,
          message: "Each holiday must be a date in YYYY-MM-DD format.",
        },
      ]);
    holidays.push(holiday);
  }
  const weekend: WeekdayName[] = [];
  for (const [index, day] of input.weekend.entries()) {
    if (typeof day !== "string" || !isWeekdayName(day))
      return invalidInput([
        {
          code: "invalid_weekday",
          field: `weekend.${index}`,
          message: "Each weekend day must be a lowercase English weekday name.",
        },
      ]);
    weekend.push(day);
  }

  try {
    return toolSuccess(flagJournalEntryDates({ entries, holidays, weekend }));
  } catch (error) {
    if (error instanceof SimpleToolError)
      return invalidInput([
        { code: error.code, field: error.field, message: error.message },
      ]);
    throw error;
  }
};

export const journalEntryDateFlagTool = defineTool<
  JournalEntryDateFlagInput,
  JournalEntryDateFlagOutput
>({
  contractVersion: 1,
  description:
    "Flag journal entries posted on configured weekend days or supplied holiday dates, preferring the holiday reason.",
  execute: executeJournalEntryDateFlag,
  execution: { kind: "pure" },
  id: "auditing/journal-entry-weekend-holiday-posting-date-flagger",
  inputSchema: {
    additionalProperties: false,
    properties: {
      entries: {
        description: "Journal entries to review, each with a posting date.",
        items: {
          additionalProperties: false,
          properties: { date: { format: "date", type: "string" } },
          required: ["date"],
          type: "object",
        },
        maxItems: toolResourceLimits.generatedValues,
        type: "array",
      },
      holidays: {
        description:
          "Holiday dates in YYYY-MM-DD format that should be flagged.",
        items: { format: "date", type: "string" },
        maxItems: toolResourceLimits.generatedValues,
        type: "array",
      },
      weekend: {
        description:
          "Lowercase English weekend day names; an empty list disables weekend flagging.",
        items: { enum: weekdayNames, type: "string" },
        maxItems: toolResourceLimits.generatedValues,
        type: "array",
      },
    },
    required: ["entries", "holidays", "weekend"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      flagged: {
        items: {
          additionalProperties: false,
          properties: {
            index: { minimum: 0, type: "integer" },
            reason: { enum: ["holiday", "weekend"], type: "string" },
          },
          required: ["index", "reason"],
          type: "object",
        },
        type: "array",
      },
      flaggedCount: { minimum: 0, type: "integer" },
    },
    required: ["flagged", "flaggedCount"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "entries",
        label: "Journal entries",
        required: true,
        valueType: {
          format: "journal-entry-posting-date",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "holidays",
        label: "Holiday dates",
        required: true,
        valueType: {
          items: { format: "date", type: "string" },
          type: "list",
        },
      },
      {
        id: "weekend",
        label: "Weekend days",
        required: true,
        valueType: { items: { type: "string" }, type: "list" },
      },
    ],
    outputs: [
      {
        id: "flagged",
        label: "Flagged entries",
        valueType: {
          format: "journal-entry-date-flag",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "flaggedCount",
        label: "Flagged count",
        valueType: { type: "integer" },
      },
    ],
  },
  title: "Journal Entry Weekend Holiday Posting Date Flagger",
});

export const runJournalEntryDateFlag = journalEntryDateFlagTool.execute;
export default journalEntryDateFlagTool;
