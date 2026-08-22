import { parsePlainDate } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  SimpleToolError,
} from "../../core/simple.js";

export type WeeksInYearInput = {
  readonly date?: string;
  readonly year?: number;
};

export type WeeksInYearOutput = {
  readonly weeksInYear: number;
};

export const weeksInYearExample = {
  input: { year: 2026 },
  output: { weeksInYear: 53 },
} satisfies ToolExample<WeeksInYearInput, WeeksInYearOutput>;

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const parseDateField = (value: string): Date => {
  try {
    return new Date(parsePlainDate(value));
  } catch (error) {
    if (error instanceof SimpleToolError)
      simpleError(error.field, error.message, "invalid_date");
    throw error;
  }
};

export const weeksInYearTool = createSimpleTool({
  id: "date/weeks-in-year",
  title: "Weeks in Year Calculator",
  description:
    "Return the number of ISO-8601 weeks in a year, given an ISO year or an ISO date.",
  inputs: [
    {
      id: "year",
      label: "ISO year",
      kind: "integer",
      maximum: 9999,
      minimum: 1,
      required: false,
    },
    {
      id: "date",
      label: "Date",
      kind: "string",
      format: "date",
      required: false,
    },
  ],
  outputs: [
    {
      id: "weeksInYear",
      label: "Weeks in year",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const hasYear = input.year !== undefined;
    const hasDate = input.date !== undefined;
    if (!hasYear && !hasDate)
      simpleError("year", "Provide an ISO year or a date.", "missing_input");
    if (hasYear && hasDate)
      simpleError(
        "date",
        "Provide either a year or a date, not both.",
        "conflicting_inputs",
      );
    let year: number;
    if (hasYear) year = input.year as number;
    else year = parseDateField(input.date as string).getUTCFullYear();
    const januaryFirstWeekday = new Date(Date.UTC(year, 0, 1)).getUTCDay();
    const has53Weeks =
      januaryFirstWeekday === 4 ||
      (januaryFirstWeekday === 3 && isLeapYear(year));
    return { weeksInYear: has53Weeks ? 53 : 52 };
  },
});
export const runWeeksInYear = weeksInYearTool.execute;
export default weeksInYearTool;
