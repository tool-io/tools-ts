import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, money } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerWaterBackupEndorsementLimitMinor: number;
  readonly observedPriorWaterBackupPaidMinor: number;
  readonly callerCurrentCoveredWaterBackupMinor: number;
  readonly callerWaterBackupDeductibleMinor: number;
}>;
export type Output = Readonly<{
  readonly callerRemainingWaterBackupLimitMinor: number;
  readonly callerModeledCurrentWaterBackupPaymentMinor: number;
  readonly currentWaterBackupAmountAboveRemainingLimitMinor: number;
}>;
const inputFields = [
  {
    id: "callerWaterBackupEndorsementLimitMinor",
    label: "Caller water backup endorsement limit minor",
    kind: "number",
  },
  {
    id: "observedPriorWaterBackupPaidMinor",
    label: "Observed prior water backup paid minor",
    kind: "number",
  },
  {
    id: "callerCurrentCoveredWaterBackupMinor",
    label: "Caller current covered water backup minor",
    kind: "number",
  },
  {
    id: "callerWaterBackupDeductibleMinor",
    label: "Caller water backup deductible minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerWaterBackupEndorsementLimitMinor,
    input.observedPriorWaterBackupPaidMinor,
    input.callerCurrentCoveredWaterBackupMinor,
    input.callerWaterBackupDeductibleMinor,
  ].forEach((v) => money(v));
  if (
    input.observedPriorWaterBackupPaidMinor >
    input.callerWaterBackupEndorsementLimitMinor
  )
    simpleError("priorPaid", "Prior paid exceeds verified term limit.");
  const remaining =
      input.callerWaterBackupEndorsementLimitMinor -
      input.observedPriorWaterBackupPaidMinor,
    eligible = Math.max(
      0,
      input.callerCurrentCoveredWaterBackupMinor -
        input.callerWaterBackupDeductibleMinor,
    );
  return {
    callerRemainingWaterBackupLimitMinor: remaining,
    callerModeledCurrentWaterBackupPaymentMinor: Math.min(remaining, eligible),
    currentWaterBackupAmountAboveRemainingLimitMinor: Math.max(
      0,
      eligible - remaining,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWaterBackupEndorsementLimitMinor: 10000,
  observedPriorWaterBackupPaidMinor: 3000,
  callerCurrentCoveredWaterBackupMinor: 9000,
  callerWaterBackupDeductibleMinor: 1000,
} satisfies Input;
export const exampleOutput = {
  callerRemainingWaterBackupLimitMinor: 7000,
  callerModeledCurrentWaterBackupPaymentMinor: 7000,
  currentWaterBackupAmountAboveRemainingLimitMinor: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/water-backup-endorsement-limit-checker",
  title: "Water Backup Endorsement Limit Checker",
  description:
    "Audit caller explicitly covered water-backup amount against actual term paid ledger, deductible and remaining endorsement limit; coverage causation must be resolved externally.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRemainingWaterBackupLimitMinor",
      label: "Caller remaining water backup limit minor",
      kind: "number",
    },
    {
      id: "callerModeledCurrentWaterBackupPaymentMinor",
      label: "Caller modeled current water backup payment minor",
      kind: "number",
    },
    {
      id: "currentWaterBackupAmountAboveRemainingLimitMinor",
      label: "Current water backup amount above remaining limit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWaterBackupEndorsementLimitMinor:
        value.callerWaterBackupEndorsementLimitMinor as number,
      observedPriorWaterBackupPaidMinor:
        value.observedPriorWaterBackupPaidMinor as number,
      callerCurrentCoveredWaterBackupMinor:
        value.callerCurrentCoveredWaterBackupMinor as number,
      callerWaterBackupDeductibleMinor:
        value.callerWaterBackupDeductibleMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
