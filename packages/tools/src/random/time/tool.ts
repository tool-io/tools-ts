import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
export type RandomTime = {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly secondsSinceMidnight: number;
  readonly text: string;
};
export const calculateRandomTime = (
  format: "12-hour" | "24-hour",
  precision: "minutes" | "seconds",
  random = Math.random,
): RandomTime | null => {
  const value = calculateRandomInteger(0, 86_399, random);
  if (value === null) return null;
  const hours = Math.floor(value / 3600),
    minutes = Math.floor((value % 3600) / 60),
    seconds = value % 60,
    suffix =
      precision === "seconds" ? `:${String(seconds).padStart(2, "0")}` : "";
  const text =
    format === "24-hour"
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}${suffix}`
      : `${hours % 12 || 12}:${String(minutes).padStart(2, "0")}${suffix} ${hours < 12 ? "AM" : "PM"}`;
  return { hours, minutes, seconds, secondsSinceMidnight: value, text };
};
export const randomTimeExample = {
  input: { format: "24-hour", precision: "minutes" },
} satisfies ToolExample<{
  readonly format: string;
  readonly precision: string;
}>;
export const randomTimeTool = createSimpleTool({
  id: "random/time",
  title: "Random Time Generator",
  description: "Generate a random clock time in 12-hour or 24-hour format.",
  inputs: [
    {
      enum: ["24-hour", "12-hour"],
      id: "format",
      kind: "string",
      label: "Clock format",
    },
    {
      enum: ["minutes", "seconds"],
      id: "precision",
      kind: "string",
      label: "Precision",
    },
  ],
  outputs: [
    {
      format: "time/clock",
      id: "result",
      kind: "object",
      label: "Random time",
    },
  ],
  calculate: (input, context) => {
    const result = calculateRandomTime(
      input.format as "12-hour" | "24-hour",
      input.precision as "minutes" | "seconds",
      context.random ?? Math.random,
    );
    if (!result)
      return simpleError(
        "",
        "The random source did not produce a usable value.",
      );
    return { result };
  },
});
export const runRandomTime = randomTimeTool.execute;
export default randomTimeTool;
