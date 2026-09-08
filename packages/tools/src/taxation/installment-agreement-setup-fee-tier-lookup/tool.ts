import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInstallmentSetupFeeKeys: readonly string[];
  readonly callerVerifiedInstallmentSetupFeeNotices: readonly string[];
  readonly queryInstallmentSetupFeeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInstallmentSetupFeeKeys",
    label: "Caller verified installment setup fee keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInstallmentSetupFeeNotices",
    label: "Caller verified installment setup fee notices",
    kind: "stringList",
  },
  {
    id: "queryInstallmentSetupFeeKey",
    label: "Query installment setup fee key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInstallmentSetupFeeKeys,
      input.callerVerifiedInstallmentSetupFeeNotices,
      input.queryInstallmentSetupFeeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInstallmentSetupFeeKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedInstallmentSetupFeeNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryInstallmentSetupFeeKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/installment-agreement-setup-fee-tier-lookup",
  title: "Installment Agreement Setup Fee Tier Lookup",
  description:
    "Caller independently verified payment-method/income/jurisdiction/year installment-fee notice; no eligibility guarantee. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedInstallmentSetupFeeKeys:
        value.callerVerifiedInstallmentSetupFeeKeys as readonly string[],
      callerVerifiedInstallmentSetupFeeNotices:
        value.callerVerifiedInstallmentSetupFeeNotices as readonly string[],
      queryInstallmentSetupFeeKey: value.queryInstallmentSetupFeeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
