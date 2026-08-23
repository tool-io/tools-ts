import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeekNumberInput = {
  readonly date: string;
};

export type WeekNumberOutput = {
  readonly isoWeekNumber: number;
  readonly isoYear: number;
};

export const calculateWeekNumber = (
  input: WeekNumberInput,
): WeekNumberOutput => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.date);
  if (!match)
    simpleError("date", "Enter a date in YYYY-MM-DD format.", "invalid_date");
  const timestamp = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  const probe = new Date(timestamp);
  if (
    probe.getUTCFullYear() !== Number(match[1]) ||
    probe.getUTCMonth() !== Number(match[2]) - 1 ||
    probe.getUTCDate() !== Number(match[3])
  )
    simpleError("date", "Enter a valid calendar date.", "invalid_date");
  const dayOfWeek = (probe.getUTCDay() + 6) % 7;
  const thursday = new Date(timestamp + (3 - dayOfWeek) * 86400000);
  const januaryFirst = Date.UTC(thursday.getUTCFullYear(), 0, 1);
  return {
    isoWeekNumber:
      Math.floor((thursday.getTime() - januaryFirst) / 86400000 / 7) + 1,
    isoYear: thursday.getUTCFullYear(),
  };
};

export const weekNumberExample = {
  input: {
    date: "2021-01-04",
  },
  output: {
    isoWeekNumber: 1,
    isoYear: 2021,
  },
} satisfies ToolExample<WeekNumberInput, WeekNumberOutput>;

export const weekNumberTool = createSimpleTool({
  id: "date/week-number",
  title: "ISO Week Number Calculator",
  description:
    "Determine the ISO-8601 week number and ISO week year of a calendar date.",
  inputs: [
    {
      description: "Calendar date in YYYY-MM-DD format.",
      id: "date",
      kind: "string",
      label: "Date",
    },
  ],
  outputs: [
    {
      description: "Week number from 1 to 53 per ISO-8601 rules.",
      id: "isoWeekNumber",
      kind: "integer",
      label: "ISO week number",
    },
    {
      description: "ISO week year owning the week.",
      id: "isoYear",
      kind: "integer",
      label: "ISO year",
    },
  ],
  calculate: (input) => calculateWeekNumber({ date: input.date as string }),
});

export const runWeekNumber = weekNumberTool.execute;
export default weekNumberTool;
