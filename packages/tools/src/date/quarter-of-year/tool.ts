import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { parsePlainDate } from "../../core/date.js";
export const quarterOfYearTool = createSimpleTool({
  id: "date/quarter-of-year",
  title: "Quarter of Year Calculator",
  description: "Return the calendar quarter (1-4) of an ISO calendar date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [{ id: "quarter", label: "Quarter", kind: "integer" }],
  calculate: (input) => {
    const month =
      new Date(parsePlainDate(input.date as string)).getUTCMonth() + 1;
    return { quarter: Math.floor((month - 1) / 3) + 1 };
  },
});
export const runQuarterOfYear = quarterOfYearTool.execute;
export default quarterOfYearTool;

export type QuarterOfYearInput = {
  readonly date: string;
};

export type QuarterOfYearOutput = {
  readonly quarter: number;
};

export const quarterOfYearExample = {
  input: {
    date: "2024-01-15",
  },
  output: {
    quarter: 1,
  },
} satisfies ToolExample<QuarterOfYearInput, QuarterOfYearOutput>;
