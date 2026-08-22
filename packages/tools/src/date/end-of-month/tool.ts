import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { formatPlainDate, parsePlainDate } from "../../core/date.js";
export const endOfMonthTool = createSimpleTool({
  id: "date/end-of-month",
  title: "End of Month Tool",
  description: "Return the last day of the month of an ISO calendar date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [
    { id: "date", label: "End of month", kind: "string", format: "date" },
  ],
  calculate: (input) => {
    const date = new Date(parsePlainDate(input.date as string));
    return {
      date: formatPlainDate(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
      ),
    };
  },
});
export const runEndOfMonth = endOfMonthTool.execute;
export default endOfMonthTool;

export type EndOfMonthInput = {
  readonly date: string;
};

export type EndOfMonthOutput = {
  readonly date: string;
};

export const endOfMonthExample = {
  input: {
    date: "2024-01-15",
  },
  output: {
    date: "2024-01-31",
  },
} satisfies ToolExample<EndOfMonthInput, EndOfMonthOutput>;
