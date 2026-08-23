import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BusinessDaysInput = {
  readonly startDate: string;
  readonly endDate: string;
  readonly holidays?: readonly string[];
};

export type BusinessDaysOutput = {
  readonly businessDayCount: number;
  readonly weekendDayCount: number;
  readonly holidayCount: number;
  readonly totalDays: number;
};

export const calculateBusinessDays = (
  input: BusinessDaysInput,
): BusinessDaysOutput => {
  const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
  const parseIsoDay = (value: string, field: string): number => {
    const match = isoPattern.exec(value);
    if (!match)
      return simpleError(
        field,
        `${field} must be a YYYY-MM-DD date.`,
        "date_invalid",
      );
    const utc = Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
    );
    const parsed = new Date(utc);
    if (
      parsed.getUTCFullYear() !== Number(match[1]) ||
      parsed.getUTCMonth() !== Number(match[2]) - 1 ||
      parsed.getUTCDate() !== Number(match[3])
    )
      return simpleError(
        field,
        `${field} must be a real calendar date.`,
        "date_impossible",
      );
    return Math.floor(utc / 86_400_000);
  };
  const weekdayOf = (day: number): number => ((day % 7) + 11) % 7;
  const startDay = parseIsoDay(input.startDate, "startDate");
  const endDay = parseIsoDay(input.endDate, "endDate");
  if (endDay < startDay)
    return simpleError(
      "endDate",
      "endDate must not precede startDate.",
      "reversed_range",
    );
  const totalDays = endDay - startDay + 1;
  const remainder = totalDays % 7;
  let partialWeekdays = 0;
  for (let offset = 0; offset < remainder; offset += 1) {
    const weekday = (weekdayOf(startDay) + offset) % 7;
    if (weekday >= 1 && weekday <= 5) partialWeekdays += 1;
  }
  const weekdayCount = 5 * Math.floor(totalDays / 7) + partialWeekdays;
  const seenHolidays = new Set<string>();
  let holidayCount = 0;
  for (const holiday of input.holidays ?? []) {
    if (seenHolidays.has(holiday)) continue;
    seenHolidays.add(holiday);
    const day = parseIsoDay(holiday, "holidays");
    if (day < startDay || day > endDay) continue;
    const weekday = weekdayOf(day);
    if (weekday >= 1 && weekday <= 5) holidayCount += 1;
  }
  return {
    businessDayCount: weekdayCount - holidayCount,
    weekendDayCount: totalDays - weekdayCount,
    holidayCount,
    totalDays,
  };
};

export const businessDaysExample = {
  input: {
    startDate: "2026-08-17",
    endDate: "2026-08-21",
    holidays: ["2026-08-19"],
  },
  output: {
    businessDayCount: 4,
    weekendDayCount: 0,
    holidayCount: 1,
    totalDays: 5,
  },
} satisfies ToolExample<BusinessDaysInput, BusinessDaysOutput>;

export const businessDaysTool = createSimpleTool({
  id: "date/business-days",
  title: "Business Days Between Dates Calculator",
  description:
    "Count weekdays Monday through Friday in an inclusive date range, optionally subtracting supplied holidays.",
  inputs: [
    {
      description: "Inclusive lower bound of the range as a YYYY-MM-DD date.",
      id: "startDate",
      kind: "string",
      label: "Start date",
    },
    {
      description: "Inclusive upper bound of the range as a YYYY-MM-DD date.",
      id: "endDate",
      kind: "string",
      label: "End date",
    },
    {
      description:
        "Holiday dates (YYYY-MM-DD) subtracted when they fall on a weekday inside the range.",
      default: [],
      id: "holidays",
      kind: "stringList",
      label: "Holidays",
    },
  ],
  outputs: [
    {
      description: "Weekdays in the range after holiday subtraction.",
      id: "businessDayCount",
      kind: "integer",
      label: "Business days",
      unit: "days",
    },
    {
      description: "Saturday and Sunday occurrences in the range.",
      id: "weekendDayCount",
      kind: "integer",
      label: "Weekend days",
      unit: "days",
    },
    {
      description: "Distinct holidays that fell on a weekday inside the range.",
      id: "holidayCount",
      kind: "integer",
      label: "Holidays applied",
    },
    {
      description: "Calendar days covered by the inclusive range.",
      id: "totalDays",
      kind: "integer",
      label: "Total days",
      unit: "days",
    },
  ],
  calculate: (input) =>
    calculateBusinessDays({
      endDate: input.endDate as string,
      holidays: input.holidays as readonly string[] | undefined,
      startDate: input.startDate as string,
    }),
});

export const runBusinessDays = businessDaysTool.execute;
export default businessDaysTool;
