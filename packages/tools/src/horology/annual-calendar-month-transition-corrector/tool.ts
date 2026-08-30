import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const daysInMonth = (year: number, month: number): number => {
  if (month === 2)
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const formatDate = (year: number, month: number, day: number): string =>
  `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

export type AnnualCalendarTransitionInput = {
  readonly day: number;
  readonly month: number;
  readonly year: number;
};

export type AnnualCalendarTransitionOutput = {
  readonly correctionRequired: boolean;
  readonly modeledMonthLength: number;
  readonly nextCalendarDate: string;
  readonly nextMonth: number;
  readonly nextYear: number;
  readonly transitionReason: string;
};

export const mapAnnualCalendarMonthTransition = (
  input: AnnualCalendarTransitionInput,
): AnnualCalendarTransitionOutput => {
  if (!Number.isSafeInteger(input.year) || input.year < 1 || input.year > 9999)
    simpleError(
      "year",
      "Year must be an integer from 1 through 9999.",
      "year_out_of_range",
    );
  if (!Number.isSafeInteger(input.month) || input.month < 1 || input.month > 12)
    simpleError(
      "month",
      "Month must be an integer from 1 through 12.",
      "month_out_of_range",
    );
  const actualMonthLength = daysInMonth(input.year, input.month);
  if (
    !Number.isSafeInteger(input.day) ||
    input.day < 1 ||
    input.day > actualMonthLength
  )
    simpleError(
      "day",
      "Day must be a valid date in the supplied Gregorian month.",
      "day_out_of_range",
    );
  const modeledMonthLength = input.month === 2 ? 30 : actualMonthLength;
  const correctionRequired =
    input.day === actualMonthLength && actualMonthLength !== modeledMonthLength;
  const nextYear =
    input.month === 12 && input.day === actualMonthLength
      ? input.year + 1
      : input.year;
  const nextMonth =
    input.day === actualMonthLength ? (input.month % 12) + 1 : input.month;
  const nextDay = input.day === actualMonthLength ? 1 : input.day + 1;
  return {
    correctionRequired,
    modeledMonthLength,
    nextCalendarDate: formatDate(nextYear, nextMonth, nextDay),
    nextMonth,
    nextYear,
    transitionReason: correctionRequired
      ? "The annual-calendar model inserts one or two non-existent dates after the Gregorian end of February, so manual correction is required."
      : "The transition follows the ordinary next calendar date.",
  };
};

export const annualCalendarTransitionExample = {
  input: { day: 29, month: 2, year: 2024 },
  output: {
    correctionRequired: true,
    modeledMonthLength: 30,
    nextCalendarDate: "2024-03-01",
    nextMonth: 3,
    nextYear: 2024,
    transitionReason:
      "The annual-calendar model inserts one or two non-existent dates after the Gregorian end of February, so manual correction is required.",
  },
} satisfies ToolExample<
  AnnualCalendarTransitionInput,
  AnnualCalendarTransitionOutput
>;

export const annualCalendarTransitionTool = createSimpleTool({
  calculate: (input) =>
    mapAnnualCalendarMonthTransition({
      day: input.day as number,
      month: input.month as number,
      year: input.year as number,
    }),
  description:
    "Map a Gregorian month-end through a conventional annual-calendar model that handles 30-day months and treats February as 30 days.",
  id: "horology/annual-calendar-month-transition-corrector",
  inputs: [
    {
      id: "day",
      kind: "integer",
      label: "Gregorian day",
      maximum: 31,
      minimum: 1,
    },
    {
      id: "month",
      kind: "integer",
      label: "Gregorian month",
      maximum: 12,
      minimum: 1,
    },
    {
      id: "year",
      kind: "integer",
      label: "Gregorian year",
      maximum: 9999,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "correctionRequired",
      kind: "boolean",
      label: "Manual correction indicated",
    },
    {
      id: "modeledMonthLength",
      kind: "integer",
      label: "Modeled month length",
      maximum: 31,
      minimum: 28,
    },
    { id: "nextCalendarDate", kind: "string", label: "Next Gregorian date" },
    {
      id: "nextMonth",
      kind: "integer",
      label: "Next month",
      maximum: 12,
      minimum: 1,
    },
    {
      id: "nextYear",
      kind: "integer",
      label: "Next year",
      maximum: 10000,
      minimum: 1,
    },
    { id: "transitionReason", kind: "string", label: "Transition reason" },
  ],
  title: "Annual Calendar Month Transition Corrector",
});

export const runAnnualCalendarTransition = annualCalendarTransitionTool.execute;
export default annualCalendarTransitionTool;
