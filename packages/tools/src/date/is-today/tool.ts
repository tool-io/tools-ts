import { millisecondsPerDay } from "../../core/date.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IsTodayInput = {
  readonly reference?: string;
  readonly value: string;
};

export type IsTodayOutput = {
  readonly isToday: boolean;
};

export const isTodayExample = {
  input: { reference: "2026-08-25T10:30:00Z", value: "2026-08-25" },
  output: { isToday: true },
} satisfies ToolExample<IsTodayInput, IsTodayOutput>;

const isoPattern =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:\d{2})?)?$/u;

const invalidDatetime = (field: string, message: string): never =>
  simpleError(field, message, "invalid_datetime");

const daysInMonth = (year: number, month: number): number => {
  const probe = new Date(0);
  probe.setUTCFullYear(year, month, 0);
  return probe.getUTCDate();
};

const utcDayIndexFromMatch = (
  match: RegExpExecArray,
  field: string,
): number => {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = match[4] === undefined ? 0 : Number(match[4]);
  const minute = match[5] === undefined ? 0 : Number(match[5]);
  const second = match[6] === undefined ? 0 : Number(match[6]);
  const millisecond =
    match[7] === undefined ? 0 : Number(match[7].slice(0, 3).padEnd(3, "0"));
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  )
    invalidDatetime(field, "Enter a valid calendar date and time.");
  const moment = new Date(0);
  moment.setUTCFullYear(year, month - 1, day);
  moment.setUTCHours(hour, minute, second, millisecond);
  const zone = match[8];
  if (zone === undefined || zone === "Z")
    return Math.floor(moment.getTime() / millisecondsPerDay);
  const zoneHours = Number(zone.slice(1, 3));
  const zoneMinutes = Number(zone.slice(4, 6));
  if (zoneHours > 23 || zoneMinutes > 59)
    invalidDatetime(field, "Enter a valid UTC offset.");
  const offsetMinutes =
    (zone.startsWith("-") ? -1 : 1) * (zoneHours * 60 + zoneMinutes);
  return Math.floor(
    (moment.getTime() - offsetMinutes * 60_000) / millisecondsPerDay,
  );
};

export const parseUtcDayIndex = (raw: string, field: string): number => {
  const match = isoPattern.exec(raw);
  if (!match)
    return invalidDatetime(
      field,
      "Enter an ISO 8601 date or date-time such as 2026-08-25 or 2026-08-25T10:30:00Z.",
    );
  return utcDayIndexFromMatch(match, field);
};

export const referenceUtcDayIndex = (
  reference: string | undefined,
  context: ToolExecutionContext,
): number => {
  if (reference !== undefined) return parseUtcDayIndex(reference, "reference");
  const now = context.now?.();
  if (now === undefined || !Number.isFinite(now))
    return simpleError(
      "reference",
      "Provide a reference date-time or an execution context clock.",
      "reference_required",
    );
  return Math.floor(now / millisecondsPerDay);
};

export const calculateIsToday = (
  input: IsTodayInput,
  context: ToolExecutionContext,
): IsTodayOutput => ({
  isToday:
    parseUtcDayIndex(input.value, "value") ===
    referenceUtcDayIndex(input.reference, context),
});

export const isTodayTool = createSimpleTool({
  calculate: (input, context) =>
    calculateIsToday(input as unknown as IsTodayInput, context),
  description:
    "Check whether an ISO 8601 date or date-time falls on the same UTC day as a reference date-time.",
  id: "date/is-today",
  inputs: [
    {
      description: "ISO 8601 date or date-time to evaluate.",
      id: "value",
      kind: "string",
      format: "date-time",
      label: "Value",
    },
    {
      description:
        "ISO 8601 reference date-time; defaults to the execution context clock.",
      id: "reference",
      kind: "string",
      format: "date-time",
      label: "Reference",
      required: false,
    },
  ],
  outputs: [{ id: "isToday", kind: "boolean", label: "Is today" }],
  title: "Is Today Checker",
});
export const runIsToday = isTodayTool.execute;
export default isTodayTool;
