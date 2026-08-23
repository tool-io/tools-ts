import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RecurrenceRuleInput = {
  readonly count: number;
  readonly frequency: "daily" | "monthly" | "weekly" | "yearly";
  readonly interval: number;
  readonly startDate: string;
};

export type RecurrenceRuleOutput = {
  readonly occurrences: readonly string[];
};

const MILLISECONDS_PER_DAY = 86_400_000;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseIsoDate = (value: string): number => {
  const match = DATE_PATTERN.exec(value);
  if (!match)
    simpleError(
      "startDate",
      "Use an ISO calendar date formatted as YYYY-MM-DD.",
      "invalid_date",
    );
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  )
    simpleError(
      "startDate",
      `${value} is not a valid calendar date.`,
      "invalid_date",
    );
  return utc;
};

const formatIsoDate = (utc: number): string =>
  new Date(utc).toISOString().slice(0, 10);

const daysInMonth = (year: number, monthIndex: number): number =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

/** Add months clamping the day of month to the target month's length. */
const addMonthsClamped = (utc: number, months: number): number => {
  const start = new Date(utc);
  const shifted = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, 1),
  );
  shifted.setUTCDate(
    Math.min(
      start.getUTCDate(),
      daysInMonth(shifted.getUTCFullYear(), shifted.getUTCMonth()),
    ),
  );
  return shifted.getTime();
};

/**
 * A simple calendar recurrence that begins at the start date and steps by
 * `interval` units. Monthly and yearly steps clamp to the target month's
 * final valid day (for example, Jan 31 + one month becomes Feb 29 in 2024).
 */
export const calculateRecurrenceRule = (
  input: RecurrenceRuleInput,
): RecurrenceRuleOutput => {
  const startUtc = parseIsoDate(input.startDate);
  const occurrences: string[] = [];
  let current = startUtc;
  for (let index = 0; index < input.count; index += 1) {
    occurrences.push(formatIsoDate(current));
    switch (input.frequency) {
      case "daily":
        current += input.interval * MILLISECONDS_PER_DAY;
        break;
      case "weekly":
        current += input.interval * 7 * MILLISECONDS_PER_DAY;
        break;
      case "monthly":
        current = addMonthsClamped(current, input.interval);
        break;
      case "yearly":
        current = addMonthsClamped(current, 12 * input.interval);
        break;
    }
  }
  return { occurrences };
};

export const recurrenceRuleExample = {
  input: {
    count: 3,
    frequency: "monthly",
    interval: 1,
    startDate: "2024-01-31",
  },
  output: {
    occurrences: ["2024-01-31", "2024-02-29", "2024-03-29"],
  },
} satisfies ToolExample<RecurrenceRuleInput, RecurrenceRuleOutput>;

export const recurrenceRuleTool = createSimpleTool({
  id: "date/recurrence-rule",
  title: "Recurrence Rule Calculator",
  description:
    "Generate recurring dates from a start date with daily/weekly/monthly/yearly frequency and interval; monthly and yearly steps clamp to the last valid day of the target month.",
  inputs: [
    {
      description: "First occurrence as an ISO date YYYY-MM-DD.",
      id: "startDate",
      kind: "string",
      label: "Start date",
    },
    {
      description: "Recurrence frequency.",
      enum: ["daily", "weekly", "monthly", "yearly"],
      id: "frequency",
      kind: "string",
      label: "Frequency",
    },
    {
      default: 1,
      description: "Step size between occurrences (at least 1).",
      id: "interval",
      kind: "integer",
      label: "Interval",
      maximum: 1000,
      minimum: 1,
    },
    {
      default: 3,
      description: "Number of occurrences to generate (1 to 52).",
      id: "count",
      kind: "integer",
      label: "Count",
      maximum: 52,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Occurrences as ISO dates, starting at the start date.",
      id: "occurrences",
      kind: "stringList",
      label: "Occurrences",
    },
  ],
  calculate: (input) =>
    calculateRecurrenceRule({
      count: input.count as number,
      frequency: input.frequency as RecurrenceRuleInput["frequency"],
      interval: input.interval as number,
      startDate: input.startDate as string,
    }),
});

export const runRecurrenceRule = recurrenceRuleTool.execute;
export default recurrenceRuleTool;
