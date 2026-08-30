import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly startYear: number;
  readonly month: number;
  readonly day: number;
  readonly recheckCount: number;
}>;
export type Output = Readonly<{
  readonly recheckDates: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  count(input.startYear, "startYear", 100);
  count(input.month, "month", 1);
  count(input.day, "day", 1);
  count(input.recheckCount, "recheckCount", 1);
  if (
    input.month > 12 ||
    input.startYear > 9999 ||
    input.recheckCount > 9999 - input.startYear ||
    input.day > new Date(Date.UTC(input.startYear, input.month, 0)).getUTCDate()
  )
    simpleError(
      "day",
      "Valid calendar date and representable recheck years required.",
    );
  const recheckDates = Array.from({ length: input.recheckCount }, (_, i) => {
    const year = input.startYear + i + 1,
      day = Math.min(
        input.day,
        new Date(Date.UTC(year, input.month, 0)).getUTCDate(),
      );
    return `${year}-${String(input.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });
  return { recheckDates };
};
export const exampleInput = {
  startYear: 2024,
  month: 2,
  day: 29,
  recheckCount: 2,
} satisfies Input;
export const exampleOutput = {
  recheckDates: ["2025-02-28", "2026-02-28"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/sentinel-annual-recheck",
  title: "Sentinel Annual Recheck",
  description:
    "Schedule annual sentinel-site rechecks, clamping leap-day anniversaries to the target month end.",
  inputs: [
    { id: "startYear", label: "Start year", kind: "integer" },
    { id: "month", label: "Month", kind: "integer" },
    { id: "day", label: "Day", kind: "integer" },
    { id: "recheckCount", label: "Recheck count", kind: "integer" },
  ],
  outputs: [{ id: "recheckDates", label: "Recheck dates", kind: "stringList" }],
  calculate: (value) =>
    calculate({
      startYear: value.startYear as number,
      month: value.month as number,
      day: value.day as number,
      recheckCount: value.recheckCount as number,
    }),
});
export const run = tool.execute;
export default tool;
