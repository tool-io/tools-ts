import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerRansomwareExtortionLimitMinor: number;
  readonly callerPriorExtortionPaidMinor: number;
  readonly callerIndependentlyCoveredExtortionDemandMinor: number;
  readonly callerExtortionRetentionMinor: number;
  readonly callerSanctionsReviewCompleted: boolean;
}>;
export type Output = Readonly<{
  readonly callerRemainingExtortionSublimitMinor: number;
  readonly callerModeledExtortionAmountMinor: number;
  readonly paymentComplianceReviewUnresolved: boolean;
}>;
const inputFields = [
  {
    id: "callerRansomwareExtortionLimitMinor",
    label: "Caller ransomware extortion limit minor",
    kind: "number",
  },
  {
    id: "callerPriorExtortionPaidMinor",
    label: "Caller prior extortion paid minor",
    kind: "number",
  },
  {
    id: "callerIndependentlyCoveredExtortionDemandMinor",
    label: "Caller independently covered extortion demand minor",
    kind: "number",
  },
  {
    id: "callerExtortionRetentionMinor",
    label: "Caller extortion retention minor",
    kind: "number",
  },
  {
    id: "callerSanctionsReviewCompleted",
    label: "Caller sanctions review completed",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerRansomwareExtortionLimitMinor,
    input.callerPriorExtortionPaidMinor,
    input.callerIndependentlyCoveredExtortionDemandMinor,
    input.callerExtortionRetentionMinor,
  ].forEach((v) => money(v));
  if (
    input.callerPriorExtortionPaidMinor >
    input.callerRansomwareExtortionLimitMinor
  )
    simpleError("paid", "Prior paid exceeds verified sublimit.");
  const remaining =
    input.callerRansomwareExtortionLimitMinor -
    input.callerPriorExtortionPaidMinor;
  return {
    callerRemainingExtortionSublimitMinor: remaining,
    callerModeledExtortionAmountMinor: Math.min(
      remaining,
      Math.max(
        0,
        input.callerIndependentlyCoveredExtortionDemandMinor -
          input.callerExtortionRetentionMinor,
      ),
    ),
    paymentComplianceReviewUnresolved: !input.callerSanctionsReviewCompleted,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRansomwareExtortionLimitMinor: 10000,
  callerPriorExtortionPaidMinor: 4000,
  callerIndependentlyCoveredExtortionDemandMinor: 8000,
  callerExtortionRetentionMinor: 1000,
  callerSanctionsReviewCompleted: false,
} satisfies Input;
export const exampleOutput = {
  callerRemainingExtortionSublimitMinor: 6000,
  callerModeledExtortionAmountMinor: 6000,
  paymentComplianceReviewUnresolved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/ransomware-extortion-sublimit-checker",
  title: "Ransomware Extortion Sublimit Checker",
  description:
    "Budget caller independently covered extortion ledger through verified remaining sublimit/retention and separate compliance-review evidence; not ransom payment recommendation, sanctions clearance or cyber recovery guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRemainingExtortionSublimitMinor",
      label: "Caller remaining extortion sublimit minor",
      kind: "number",
    },
    {
      id: "callerModeledExtortionAmountMinor",
      label: "Caller modeled extortion amount minor",
      kind: "number",
    },
    {
      id: "paymentComplianceReviewUnresolved",
      label: "Payment compliance review unresolved",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRansomwareExtortionLimitMinor:
        value.callerRansomwareExtortionLimitMinor as number,
      callerPriorExtortionPaidMinor:
        value.callerPriorExtortionPaidMinor as number,
      callerIndependentlyCoveredExtortionDemandMinor:
        value.callerIndependentlyCoveredExtortionDemandMinor as number,
      callerExtortionRetentionMinor:
        value.callerExtortionRetentionMinor as number,
      callerSanctionsReviewCompleted:
        value.callerSanctionsReviewCompleted as boolean,
    }),
});
export const run = tool.execute;
export default tool;
