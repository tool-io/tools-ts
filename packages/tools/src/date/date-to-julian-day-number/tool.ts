import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DateToJdnInput = {
  readonly date: string;
};

export type DateToJdnOutput = {
  readonly jdn: number;
};

export const dateToJdnExample = {
  input: { date: "2000-01-01" },
  output: { jdn: 2451545 },
} satisfies ToolExample<DateToJdnInput, DateToJdnOutput>;

export const calculateDateToJdn = (input: DateToJdnInput): DateToJdnOutput => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(input.date);
  if (!m) return simpleError("date", "Use YYYY-MM-DD format.", "invalid_date");
  let y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  const leapYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth[mo - 1]!)
    return simpleError(
      "date",
      "Enter a valid Gregorian calendar date.",
      "invalid_date",
    );
  const a = Math.floor((14 - mo) / 12);
  y += 4800 - a;
  const adjustedMonth = mo + 12 * a - 3;
  return {
    jdn:
      d +
      Math.floor((153 * adjustedMonth + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045,
  };
};

export const dateToJdnTool = createSimpleTool({
  calculate: (input) => calculateDateToJdn(input as unknown as DateToJdnInput),
  description: "Convert a Gregorian calendar date to its Julian Day Number.",
  id: "date/date-to-julian-day-number",
  inputs: [
    {
      description: "Gregorian date.",
      id: "date",
      kind: "string",
      label: "Date",
    },
  ],
  outputs: [
    {
      description: "Julian Day Number.",
      format: "jdn",
      id: "jdn",
      kind: "integer",
      label: "JDN",
    },
  ],
  title: "Date to Julian Day Number Converter",
});
export const runDateToJdn = dateToJdnTool.execute;
export default dateToJdnTool;
