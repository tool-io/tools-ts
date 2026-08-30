import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TourbillonRevolutionsPerDayInput = Readonly<{
  readonly periodSeconds: number;
}>;
export type TourbillonRevolutionsPerDayOutput = Readonly<{
  readonly revolutionsPerDay: number;
}>;

export const calculateTourbillonRevolutionsPerDay = (
  x: TourbillonRevolutionsPerDayInput,
): TourbillonRevolutionsPerDayOutput => {
  if (!Number.isFinite(x.periodSeconds) || x.periodSeconds <= 0)
    simpleError("periodSeconds", "Provide a finite positive number.");
  const revolutionsPerDay = 86400 / x.periodSeconds;
  if (!Number.isFinite(revolutionsPerDay))
    simpleError(
      "revolutionsPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    revolutionsPerDay: Object.is(revolutionsPerDay, -0) ? 0 : revolutionsPerDay,
  };
};

export const example = {
  input: {
    periodSeconds: 60,
  },
  output: { revolutionsPerDay: 1440 },
} satisfies ToolExample<
  TourbillonRevolutionsPerDayInput,
  TourbillonRevolutionsPerDayOutput
>;

export const tool = createSimpleTool({
  id: "horology/tourbillon-revolutions-per-day",
  title: "Tourbillon Revolutions Per Day",
  description:
    "Tourbillon cage revolutions per 24-hour day from its rotation period in seconds.",
  inputs: [
    {
      id: "periodSeconds",
      kind: "number",
      label: "Period Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "revolutionsPerDay",
      kind: "number",
      label: "Revolutions Per Day",
      unit: "rev/day",
    },
  ],
  calculate: (input) =>
    calculateTourbillonRevolutionsPerDay({
      periodSeconds: input.periodSeconds as number,
    }),
});
export const tourbillonRevolutionsPerDayTool = tool;
export const runTourbillonRevolutionsPerDay = tool.execute;
export default tool;
