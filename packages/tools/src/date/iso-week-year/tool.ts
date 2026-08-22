import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { millisecondsPerDay, parsePlainDate } from "../../core/date.js";
export const isoWeekYearTool = createSimpleTool({
  id: "date/iso-week-year",
  title: "ISO Week Year Calculator",
  description:
    "Return the ISO-8601 week-numbering year that owns the week of an ISO calendar date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [{ id: "isoWeekYear", label: "ISO week year", kind: "integer" }],
  calculate: (input) => {
    const timestamp = parsePlainDate(input.date as string);
    const date = new Date(timestamp);
    const isoWeekday = (date.getUTCDay() + 6) % 7;
    const thursday = new Date(
      timestamp + (3 - isoWeekday) * millisecondsPerDay,
    );
    return { isoWeekYear: thursday.getUTCFullYear() };
  },
});
export const runIsoWeekYear = isoWeekYearTool.execute;
export default isoWeekYearTool;

export type IsoWeekYearInput = {
  readonly date: string;
};

export type IsoWeekYearOutput = {
  readonly isoWeekYear: number;
};

export const isoWeekYearExample = {
  input: {
    date: "2024-01-15",
  },
  output: {
    isoWeekYear: 2024,
  },
} satisfies ToolExample<IsoWeekYearInput, IsoWeekYearOutput>;
