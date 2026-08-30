import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly originalDeadline: string;
  readonly postponementDays: number;
}>;
export type Output = Readonly<{
  readonly adjustedDeadline: string;
  readonly daysShifted: number;
}>;

export const calculate = (input: Input): Output => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.originalDeadline))
    simpleError(
      "originalDeadline",
      "Deadline must use YYYY-MM-DD.",
      "invalid_date",
    );
  const date = new Date(`${input.originalDeadline}T00:00:00Z`);
  if (Number.isNaN(date.getTime()))
    simpleError(
      "originalDeadline",
      "Deadline is not a valid date.",
      "invalid_date",
    );
  date.setUTCDate(date.getUTCDate() + input.postponementDays);
  return {
    adjustedDeadline: date.toISOString().slice(0, 10),
    daysShifted: input.postponementDays,
  };
};

export const exampleInput = {
  originalDeadline: "2025-01-01",
  postponementDays: 10,
} satisfies Input;
export const exampleOutput = {
  adjustedDeadline: "2025-01-11",
  daysShifted: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      originalDeadline: input.originalDeadline as string,
      postponementDays: input.postponementDays as number,
    }),
  description:
    "Shift a filing deadline by a caller-supplied disaster-relief postponement.",
  id: "taxation/relief-deadline-shift",
  inputs: [
    { id: "originalDeadline", label: "Original deadline", kind: "string" },
    {
      id: "postponementDays",
      label: "Postponement days",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "adjustedDeadline", label: "Adjusted deadline", kind: "string" },
    { id: "daysShifted", label: "Days shifted", kind: "integer", minimum: 0 },
  ],
  title: "Relief Deadline Shift",
});

export const run = tool.execute;
export default tool;
