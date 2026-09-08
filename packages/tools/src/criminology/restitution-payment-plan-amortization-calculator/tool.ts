import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyAuthorizedRestitutionBalanceMinor: number;
  readonly callerPermittedPeriodPaymentMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAuthorizedRestitutionBalanceMinor",
    label: "Independently authorized restitution balance minor",
    kind: "number",
  },
  {
    id: "callerPermittedPeriodPaymentMinor",
    label: "Caller permitted period payment minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.independentlyAuthorizedRestitutionBalanceMinor, "balance");
  money(input.callerPermittedPeriodPaymentMinor, "payment");
  positive(input.callerPermittedPeriodPaymentMinor, "payment");
  const b = BigInt(input.independentlyAuthorizedRestitutionBalanceMinor),
    p = BigInt(input.callerPermittedPeriodPaymentMinor),
    n = (b + p - 1n) / p;
  return {
    conditionalWholePaymentPeriodCount: Number(n),
    lastConditionalPaymentMinor: n ? Number(b - (n - 1n) * p) : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAuthorizedRestitutionBalanceMinor: 100,
    callerPermittedPeriodPaymentMinor: 30,
  },
  output: {
    result: {
      conditionalWholePaymentPeriodCount: 4,
      lastConditionalPaymentMinor: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/restitution-payment-plan-amortization-calculator",
  title: "Restitution Payment Plan Amortization Calculator",
  description:
    "Conditional zero-interest installment arithmetic under independently legally authorized balance/payment terms. Exact minor units, no fee/interest/defaults, ability-to-pay determination, judicial alteration or entitlement implied.",
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
