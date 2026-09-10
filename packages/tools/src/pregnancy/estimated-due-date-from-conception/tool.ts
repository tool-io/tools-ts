import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  shiftDate,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedConceptionDate: string;
  readonly callerVerifiedConceptionToTermDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedConceptionDate",
    label: "Independently established conception date",
    kind: "string",
  },
  {
    id: "callerVerifiedConceptionToTermDays",
    label: "Caller verified conception to term days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerVerifiedConceptionToTermDays, "duration", 200, 320);
  return {
    conditionalEstimatedDueDate: shiftDate(
      input.independentlyEstablishedConceptionDate,
      input.callerVerifiedConceptionToTermDays,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedConceptionDate: "2026-01-01",
    callerVerifiedConceptionToTermDays: 266,
  },
  output: { result: { conditionalEstimatedDueDate: "2026-09-24" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/estimated-due-date-from-conception",
  title: "Estimated Due Date From Conception Calculator",
  description:
    "Conception-date plus explicit convention duration; actual fertilization date/dating applicability independently established, not a prediction of delivery, cycle-based proof or universal exact gestation length.",
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
