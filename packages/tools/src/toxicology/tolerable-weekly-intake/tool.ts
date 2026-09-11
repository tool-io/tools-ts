import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerAuthoritativelyApplicableDailyIntakeMassPerKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerAuthoritativelyApplicableDailyIntakeMassPerKg",
    label: "Caller authoritatively applicable daily intake mass per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerAuthoritativelyApplicableDailyIntakeMassPerKg,
    "independent-reference",
  );
  return {
    conditionalSameBasisWeeklyIntakeMassPerKg:
      7 * input.callerAuthoritativelyApplicableDailyIntakeMassPerKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerAuthoritativelyApplicableDailyIntakeMassPerKg: 2 },
  output: { result: { conditionalSameBasisWeeklyIntakeMassPerKg: 14 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/tolerable-weekly-intake",
  title: "Tolerable Weekly Intake Calculator",
  description:
    "Seven-day bookkeeping of independently authoritative same-basis DAILYreference. Does not derive an authoritative TWI, permit one-day bolus intake or imply acute/chronic toxicological equivalence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
