import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly currentYearDays: number;
  readonly previousYearDays: number;
  readonly secondPreviousYearDays: number;
  readonly weightedDayThreshold: number;
}>;
export type Output = Readonly<{
  readonly weightedPresenceDays: number;
  readonly meetsWeightedThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const weightedPresenceDays =
    input.currentYearDays +
    input.previousYearDays / 3 +
    input.secondPreviousYearDays / 6;
  return {
    weightedPresenceDays,
    meetsWeightedThreshold: weightedPresenceDays >= input.weightedDayThreshold,
  };
};

export const exampleInput = {
  currentYearDays: 120,
  previousYearDays: 120,
  secondPreviousYearDays: 120,
  weightedDayThreshold: 183,
} satisfies Input;
export const exampleOutput = {
  weightedPresenceDays: 180,
  meetsWeightedThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      currentYearDays: input.currentYearDays as number,
      previousYearDays: input.previousYearDays as number,
      secondPreviousYearDays: input.secondPreviousYearDays as number,
      weightedDayThreshold: input.weightedDayThreshold as number,
    }),
  description:
    "Apply one, one-third, and one-sixth day weights against a caller-supplied presence threshold.",
  id: "taxation/substantial-presence-days",
  inputs: [
    {
      id: "currentYearDays",
      label: "Current-year presence days",
      kind: "integer",
      minimum: 0,
      maximum: 366,
    },
    {
      id: "previousYearDays",
      label: "Previous-year presence days",
      kind: "integer",
      minimum: 0,
      maximum: 366,
    },
    {
      id: "secondPreviousYearDays",
      label: "Second-previous-year presence days",
      kind: "integer",
      minimum: 0,
      maximum: 366,
    },
    {
      id: "weightedDayThreshold",
      label: "Weighted-day threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "weightedPresenceDays",
      label: "Weighted presence days",
      kind: "number",
      minimum: 0,
    },
    {
      id: "meetsWeightedThreshold",
      label: "Meets weighted threshold",
      kind: "boolean",
    },
  ],
  title: "Substantial-Presence Days",
});

export const run = tool.execute;
export default tool;
