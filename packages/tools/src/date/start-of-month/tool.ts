import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { formatPlainDate, parsePlainDate } from "../../core/date.js";
export const startOfMonthTool = createSimpleTool({
  id: "date/start-of-month",
  title: "Start of Month Tool",
  description: "Return the first day of the month of an ISO calendar date.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [
    { id: "date", label: "Start of month", kind: "string", format: "date" },
  ],
  calculate: (input) => {
    const date = new Date(parsePlainDate(input.date as string));
    return {
      date: formatPlainDate(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
      ),
    };
  },
});
export const runStartOfMonth = startOfMonthTool.execute;
export default startOfMonthTool;

export type StartOfMonthInput = {
  readonly date: string;
};

export type StartOfMonthOutput = {
  readonly date: string;
};

export const startOfMonthExample = {
  input: {
    date: "2024-01-15",
  },
  output: {
    date: "2024-01-01",
  },
} satisfies ToolExample<StartOfMonthInput, StartOfMonthOutput>;
