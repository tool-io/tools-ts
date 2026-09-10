import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  daysBetween,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedLmpDate: string;
  readonly asOfDate: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedLmpDate",
    label: "Independently recorded lmp date",
    kind: "string",
  },
  { id: "asOfDate", label: "As of date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const d = daysBetween(input.independentlyRecordedLmpDate, input.asOfDate);
  bounded(d, "observed-calendar-days", 0, 450);
  return {
    conditionalGestationalDays: d,
    completedGestationalWeeks: Math.floor(d / 7),
    additionalGestationalDays: d % 7,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyRecordedLmpDate: "2026-01-01", asOfDate: "2026-02-01" },
  output: {
    result: {
      conditionalGestationalDays: 31,
      completedGestationalWeeks: 4,
      additionalGestationalDays: 3,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/gestational-age-from-lmp",
  title: "Gestational Age From LMP Calculator",
  description:
    "Arithmetic obstetric age from independently established LMPdate, not conception verification or confirmation of pregnancy. Manual Gregorian date validation; uncertain cycles, LMPand ultrasound dating must be reviewed clinically.",
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
