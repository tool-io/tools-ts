import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  shiftDate,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedLmpDate: string;
  readonly callerVerifiedCycleLengthDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedLmpDate",
    label: "Independently recorded lmp date",
    kind: "string",
  },
  {
    id: "callerVerifiedCycleLengthDays",
    label: "Caller verified cycle length days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerVerifiedCycleLengthDays, "cycle", 15, 60);
  return {
    conditionalEstimatedDueDate: shiftDate(
      input.independentlyRecordedLmpDate,
      280 + input.callerVerifiedCycleLengthDays - 28,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedLmpDate: "2026-01-01",
    callerVerifiedCycleLengthDays: 28,
  },
  output: { result: { conditionalEstimatedDueDate: "2026-10-08" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/due-date-naegele",
  title: "Due Date Naegele Calculator",
  description:
    "Simplified Naegele280-day LMPconvention with explicitly caller-established cycle-length adjustment relative to28 days. Not a predicted birth date, calendar-month shortcut or clinically verified dating; irregular cycles/luteal duration may invalidate assumptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
