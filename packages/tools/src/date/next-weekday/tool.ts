import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  formatPlainDate,
  millisecondsPerDay,
  parsePlainDate,
} from "../../core/date.js";
export const nextWeekdayTool = createSimpleTool({
  id: "date/next-weekday",
  title: "Next Weekday Finder",
  description:
    "Find the first date after an ISO calendar date that falls on a target ISO weekday.",
  inputs: [
    { id: "date", label: "Date", kind: "string", format: "date" },
    {
      description: "ISO weekday where Monday is 1 and Sunday is 7.",
      id: "weekday",
      label: "Target weekday",
      kind: "integer",
      maximum: 7,
      minimum: 1,
    },
  ],
  outputs: [{ id: "date", label: "Next date", kind: "string", format: "date" }],
  calculate: (input) => {
    const timestamp = parsePlainDate(input.date as string);
    const current = ((new Date(timestamp).getUTCDay() + 6) % 7) + 1;
    const target = input.weekday as number;
    const daysAhead = ((target - current + 6) % 7) + 1;
    return {
      date: formatPlainDate(timestamp + daysAhead * millisecondsPerDay),
    };
  },
});
export const runNextWeekday = nextWeekdayTool.execute;
export default nextWeekdayTool;

export type NextWeekdayInput = {
  readonly date: string;
  readonly weekday: number;
};

export type NextWeekdayOutput = {
  readonly date: string;
};

export const nextWeekdayExample = {
  input: {
    date: "2024-01-15",
    weekday: 1,
  },
  output: {
    date: "2024-01-22",
  },
} satisfies ToolExample<NextWeekdayInput, NextWeekdayOutput>;
