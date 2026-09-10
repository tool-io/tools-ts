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
  readonly callerAssumedLutealPhaseDays: number;
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
  {
    id: "callerAssumedLutealPhaseDays",
    label: "Caller assumed luteal phase days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerVerifiedCycleLengthDays, "cycle", 15, 60);
  bounded(
    input.callerAssumedLutealPhaseDays,
    "luteal",
    1,
    input.callerVerifiedCycleLengthDays,
  );
  return {
    conditionalConceptionWindowAnchorDate: shiftDate(
      input.independentlyRecordedLmpDate,
      input.callerVerifiedCycleLengthDays - input.callerAssumedLutealPhaseDays,
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
    callerAssumedLutealPhaseDays: 14,
  },
  output: { result: { conditionalConceptionWindowAnchorDate: "2026-01-15" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/conception-date",
  title: "Conception Date Calculator",
  description:
    "Conditional LMP/cycle-minus-luteal conception anchor, not verified fertilization/ovulation, date certainty or contraception guidance. Explicit assumptions do not establish pregnancy or account for sperm survival.",
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
