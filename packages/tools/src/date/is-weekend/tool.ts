import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { parsePlainDate } from "../../core/date.js";
export const isWeekendTool = createSimpleTool({
  id: "date/is-weekend",
  title: "Is Weekend Checker",
  description:
    "Check whether an ISO calendar date falls on a Saturday or Sunday.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [{ id: "weekend", label: "Weekend", kind: "boolean" }],
  calculate: (input) => {
    const day = new Date(parsePlainDate(input.date as string)).getUTCDay();
    return { weekend: day === 0 || day === 6 };
  },
});
export const runIsWeekend = isWeekendTool.execute;
export default isWeekendTool;

export type IsWeekendInput = {
  readonly date: string;
};

export type IsWeekendOutput = {
  readonly weekend: boolean;
};

export const isWeekendExample = {
  input: {
    date: "2024-01-15",
  },
  output: {
    weekend: false,
  },
} satisfies ToolExample<IsWeekendInput, IsWeekendOutput>;
