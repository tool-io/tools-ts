import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  rateMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly eligiblePaymentMinor: number;
  readonly callerBackupWithholdingTriggerConfirmed: boolean;
  readonly callerApplicableBackupBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly conditionalBackupWithholdingMinor: number;
  readonly remainingPaymentMinor: number;
}>;
const inputFields = [
  {
    id: "eligiblePaymentMinor",
    label: "Eligible payment minor",
    kind: "number",
  },
  {
    id: "callerBackupWithholdingTriggerConfirmed",
    label: "Caller backup withholding trigger confirmed",
    kind: "boolean",
  },
  {
    id: "callerApplicableBackupBasisPoints",
    label: "Caller applicable backup basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.eligiblePaymentMinor, "eligiblePaymentMinor");
  bounded(input.callerApplicableBackupBasisPoints, "rate", 0, 10000);
  const w = input.callerBackupWithholdingTriggerConfirmed
    ? rateMinor(
        input.eligiblePaymentMinor,
        input.callerApplicableBackupBasisPoints,
      )
    : 0;
  return {
    conditionalBackupWithholdingMinor: w,
    remainingPaymentMinor: input.eligiblePaymentMinor - w,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eligiblePaymentMinor: 100,
  callerBackupWithholdingTriggerConfirmed: true,
  callerApplicableBackupBasisPoints: 2400,
} satisfies Input;
export const exampleOutput = {
  conditionalBackupWithholdingMinor: 24,
  remainingPaymentMinor: 76,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/backup-withholding-24-percent-trigger-checker",
  title: "Backup Withholding 24 Percent Trigger Checker",
  description:
    "Caller independently confirmed backup-withholding trigger and applicable rate, title24%not a current-law assertion. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalBackupWithholdingMinor",
      label: "Conditional backup withholding minor",
      kind: "number",
    },
    {
      id: "remainingPaymentMinor",
      label: "Remaining payment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eligiblePaymentMinor: value.eligiblePaymentMinor as number,
      callerBackupWithholdingTriggerConfirmed:
        value.callerBackupWithholdingTriggerConfirmed as boolean,
      callerApplicableBackupBasisPoints:
        value.callerApplicableBackupBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
