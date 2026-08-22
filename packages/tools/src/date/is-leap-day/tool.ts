import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { parsePlainDate } from "../../core/date.js";
export const isLeapDayTool = createSimpleTool({
  id: "date/is-leap-day",
  title: "Is Leap Day Checker",
  description:
    "Check whether an ISO calendar date is February 29 of a leap year.",
  inputs: [{ id: "date", label: "Date", kind: "string", format: "date" }],
  outputs: [{ id: "leapDay", label: "Leap day", kind: "boolean" }],
  calculate: (input) => {
    const date = new Date(parsePlainDate(input.date as string));
    return {
      leapDay: date.getUTCMonth() === 1 && date.getUTCDate() === 29,
    };
  },
});
export const runIsLeapDay = isLeapDayTool.execute;
export default isLeapDayTool;

export type IsLeapDayInput = {
  readonly date: string;
};

export type IsLeapDayOutput = {
  readonly leapDay: boolean;
};

export const isLeapDayExample = {
  input: {
    date: "2024-01-15",
  },
  output: {
    leapDay: false,
  },
} satisfies ToolExample<IsLeapDayInput, IsLeapDayOutput>;
