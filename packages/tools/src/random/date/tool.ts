import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
const day = 86_400_000;
const parseDate = (value: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === value
    ? timestamp
    : null;
};
export const calculateRandomDate = (
  start: string,
  end: string,
  random = Math.random,
): string | null => {
  const startTime = parseDate(start),
    endTime = parseDate(end);
  if (startTime === null || endTime === null || startTime > endTime)
    return null;
  const offset = calculateRandomInteger(0, (endTime - startTime) / day, random);
  return offset === null
    ? null
    : new Date(startTime + offset * day).toISOString().slice(0, 10);
};
export const randomDateExample = {
  input: { end: "2026-12-31", start: "2026-01-01" },
} satisfies ToolExample<{ readonly end: string; readonly start: string }>;
export const randomDateTool = createSimpleTool({
  id: "random/date",
  title: "Random Date Generator",
  description:
    "Generate a random UTC calendar date within an inclusive date range.",
  inputs: [
    {
      format: "date/iso-8601",
      id: "start",
      kind: "string",
      label: "Start date",
    },
    { format: "date/iso-8601", id: "end", kind: "string", label: "End date" },
  ],
  outputs: [
    {
      format: "date/iso-8601",
      id: "date",
      kind: "string",
      label: "Random date",
    },
  ],
  calculate: (input, context) => {
    const date = calculateRandomDate(
      input.start as string,
      input.end as string,
      context.random ?? Math.random,
    );
    if (!date)
      return simpleError(
        "end",
        "Enter valid ISO calendar dates in ascending order.",
      );
    return { date };
  },
});
export const runRandomDate = randomDateTool.execute;
export default randomDateTool;
