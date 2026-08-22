import { parsePlainDate } from "../../core/date.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  SimpleToolError,
} from "../../core/simple.js";

export type DaysInQuarterInput = {
  readonly date: string;
};

export type DaysInQuarterOutput = {
  readonly daysInQuarter: number;
};

export const daysInQuarterExample = {
  input: { date: "2024-05-15" },
  output: { daysInQuarter: 91 },
} satisfies ToolExample<DaysInQuarterInput, DaysInQuarterOutput>;

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInFirstQuarter = (leap: boolean): number => (leap ? 91 : 90);

const daysInQuarterOfYear = (year: number, quarter: number): number => {
  if (quarter === 1) return daysInFirstQuarter(isLeapYear(year));
  if (quarter === 2) return 91;
  return 92;
};

export const daysInQuarterTool = createSimpleTool({
  id: "date/days-in-quarter",
  title: "Days in Quarter Calculator",
  description:
    "Return the number of calendar days in the Gregorian quarter containing an ISO date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [
    {
      id: "daysInQuarter",
      label: "Days in quarter",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    let timestamp: number;
    try {
      timestamp = parsePlainDate(input.date as string);
    } catch (error) {
      if (error instanceof SimpleToolError)
        simpleError(error.field, error.message, "invalid_date");
      throw error;
    }
    const date = new Date(timestamp);
    const month = date.getUTCMonth() + 1;
    return {
      daysInQuarter: daysInQuarterOfYear(
        date.getUTCFullYear(),
        Math.ceil(month / 3),
      ),
    };
  },
});
export const runDaysInQuarter = daysInQuarterTool.execute;
export default daysInQuarterTool;
