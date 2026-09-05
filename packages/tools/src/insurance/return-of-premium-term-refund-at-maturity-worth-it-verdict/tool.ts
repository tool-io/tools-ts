import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  money,
  signedSum,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly returnOfPremiumPolicyTotalPremiumMinor: number;
  readonly comparableTermTotalPremiumMinor: number;
  readonly independentlyVerifiedEligibleRefundMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "returnOfPremiumPolicyTotalPremiumMinor",
    label: "Return of premium policy total premium minor",
    kind: "number",
  },
  {
    id: "comparableTermTotalPremiumMinor",
    label: "Comparable term total premium minor",
    kind: "number",
  },
  {
    id: "independentlyVerifiedEligibleRefundMinor",
    label: "Independently verified eligible refund minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.returnOfPremiumPolicyTotalPremiumMinor,
    input.comparableTermTotalPremiumMinor,
    input.independentlyVerifiedEligibleRefundMinor,
  ].forEach((v) => money(v, "amount"));
  if (
    input.independentlyVerifiedEligibleRefundMinor >
    input.returnOfPremiumPolicyTotalPremiumMinor
  )
    simpleError(
      "refund",
      "Caller eligible refund no greater than entered total policy premiums in this restricted model.",
    );
  const extra = signedSum([
    input.returnOfPremiumPolicyTotalPremiumMinor,
    -input.comparableTermTotalPremiumMinor,
  ]);
  return {
    extraNominalPremiumMinor: extra,
    conditionalNominalNetExtraOutlayMinor: signedSum([
      extra,
      -input.independentlyVerifiedEligibleRefundMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    returnOfPremiumPolicyTotalPremiumMinor: 30000,
    comparableTermTotalPremiumMinor: 20000,
    independentlyVerifiedEligibleRefundMinor: 25000,
  },
  output: {
    result: {
      extraNominalPremiumMinor: 10000,
      conditionalNominalNetExtraOutlayMinor: -15000,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/return-of-premium-term-refund-at-maturity-worth-it-verdict",
  title: "Return of Premium Term Refund At Maturity Worth It Verdict",
  description:
    "Conditional nominal return-of-premium comparison using matched coverage/time and independently verified refund eligibility. Exact one-currency minor units; ignores timing, investment returns, fees, tax and early lapse, so not a worth-it verdict.",
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
