import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mealOccurrences: number;
  readonly employeeCount: number;
  readonly observationWeeks: number;
  readonly maximumOccurrencesPerEmployeeWeek: number;
}>;
export type Output = Readonly<{
  readonly occurrencesPerEmployeeWeek: number;
  readonly withinCallerFrequency: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.observationWeeks <= 0)
    simpleError(
      "observationWeeks",
      "Observation period must be positive.",
      "invalid_period",
    );
  const occurrencesPerEmployeeWeek =
    input.mealOccurrences / (input.employeeCount * input.observationWeeks);
  return {
    occurrencesPerEmployeeWeek,
    withinCallerFrequency:
      occurrencesPerEmployeeWeek <= input.maximumOccurrencesPerEmployeeWeek,
  };
};

export const exampleInput = {
  mealOccurrences: 20,
  employeeCount: 10,
  observationWeeks: 4,
  maximumOccurrencesPerEmployeeWeek: 1,
} satisfies Input;
export const exampleOutput = {
  occurrencesPerEmployeeWeek: 0.5,
  withinCallerFrequency: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      mealOccurrences: input.mealOccurrences as number,
      employeeCount: input.employeeCount as number,
      observationWeeks: input.observationWeeks as number,
      maximumOccurrencesPerEmployeeWeek:
        input.maximumOccurrencesPerEmployeeWeek as number,
    }),
  description:
    "Measure meal frequency per employee-week against a caller-defined de minimis boundary.",
  id: "taxation/de-minimis-meal-screen",
  inputs: [
    {
      id: "mealOccurrences",
      label: "Meal occurrences",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "employeeCount",
      label: "Covered employees",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "observationWeeks",
      label: "Observation period",
      kind: "number",
      minimum: 0,
      unit: "weeks",
    },
    {
      id: "maximumOccurrencesPerEmployeeWeek",
      label: "Caller maximum frequency",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "occurrencesPerEmployeeWeek",
      label: "Occurrences per employee-week",
      kind: "number",
      minimum: 0,
    },
    {
      id: "withinCallerFrequency",
      label: "Within caller frequency",
      kind: "boolean",
    },
  ],
  title: "De Minimis Meal Screen",
});

export const run = tool.execute;
export default tool;
