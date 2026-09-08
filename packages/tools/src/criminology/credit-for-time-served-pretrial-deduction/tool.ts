import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyAuthorizedSentenceDays: number;
  readonly independentlyVerifiedNonoverlappingCreditableDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAuthorizedSentenceDays",
    label: "Independently authorized sentence days",
    kind: "number",
  },
  {
    id: "independentlyVerifiedNonoverlappingCreditableDays",
    label: "Independently verified nonoverlapping creditable days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyAuthorizedSentenceDays, "sentence", 0, 1000000);
  bounded(
    input.independentlyVerifiedNonoverlappingCreditableDays,
    "credit",
    0,
    input.independentlyAuthorizedSentenceDays,
  );
  return {
    conditionalRemainingDays:
      input.independentlyAuthorizedSentenceDays -
      input.independentlyVerifiedNonoverlappingCreditableDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAuthorizedSentenceDays: 100,
    independentlyVerifiedNonoverlappingCreditableDays: 30,
  },
  output: { result: { conditionalRemainingDays: 70 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/credit-for-time-served-pretrial-deduction",
  title: "Credit For Time Served Pretrial Deduction Calculator",
  description:
    "Conditional subtraction of independently verified nonoverlapping legally creditable pretrial days, not decide detention law, credit eligibility or release date.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
