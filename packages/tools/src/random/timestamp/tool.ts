import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
export const calculateRandomTimestamp = (
  start: string,
  end: string,
  unit: "milliseconds" | "seconds",
  random = Math.random,
): number | null => {
  const startMs = Date.parse(start),
    endMs = Date.parse(end),
    divisor = unit === "seconds" ? 1_000 : 1;
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs > endMs)
    return null;
  return calculateRandomInteger(
    Math.ceil(startMs / divisor),
    Math.floor(endMs / divisor),
    random,
  );
};
export const randomTimestampExample = {
  input: {
    end: "2026-12-31T23:59:59Z",
    start: "2026-01-01T00:00:00Z",
    unit: "seconds",
  },
} satisfies ToolExample<{
  readonly end: string;
  readonly start: string;
  readonly unit: string;
}>;
export const randomTimestampTool = createSimpleTool({
  id: "random/timestamp",
  title: "Random Timestamp Generator",
  description: "Generate a random Unix timestamp within a date-time range.",
  inputs: [
    {
      format: "datetime/iso-8601",
      id: "start",
      kind: "string",
      label: "Start date and time",
    },
    {
      format: "datetime/iso-8601",
      id: "end",
      kind: "string",
      label: "End date and time",
    },
    {
      enum: ["seconds", "milliseconds"],
      id: "unit",
      kind: "string",
      label: "Unit",
    },
  ],
  outputs: [
    {
      format: "timestamp/unix",
      id: "timestamp",
      kind: "integer",
      label: "Random timestamp",
    },
  ],
  calculate: (input, context) => {
    const timestamp = calculateRandomTimestamp(
      input.start as string,
      input.end as string,
      input.unit as "milliseconds" | "seconds",
      context.random ?? Math.random,
    );
    if (timestamp === null)
      return simpleError("end", "Enter valid date-times in ascending order.");
    return { timestamp };
  },
});
export const runRandomTimestamp = randomTimestampTool.execute;
export default randomTimestampTool;
