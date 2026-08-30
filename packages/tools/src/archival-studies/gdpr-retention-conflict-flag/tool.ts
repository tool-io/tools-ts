import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, binary } from "../shared.js";
export type Input = Readonly<{
  readonly requiredRetentionUntilOrdinals: readonly number[];
  readonly callerPrivacyDeleteByOrdinals: readonly number[];
  readonly legalHoldFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly retentionPrivacyConflictFlags: readonly number[];
  readonly signedRetentionBeyondDeletionDays: readonly number[];
  readonly holdRequiresSeparateReviewFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "requiredRetentionUntilOrdinals",
    label: "Required retention until ordinals",
    kind: "numberList",
  },
  {
    id: "callerPrivacyDeleteByOrdinals",
    label: "Caller privacy delete by ordinals",
    kind: "numberList",
  },
  { id: "legalHoldFlags", label: "Legal hold flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.requiredRetentionUntilOrdinals.forEach((v) =>
    count(v, "requiredRetentionUntilOrdinals"),
  );
  input.callerPrivacyDeleteByOrdinals.forEach((v) =>
    count(v, "callerPrivacyDeleteByOrdinals"),
  );
  aligned(
    input.requiredRetentionUntilOrdinals,
    input.callerPrivacyDeleteByOrdinals,
    "requiredRetentionUntilOrdinals",
  );
  aligned(
    input.requiredRetentionUntilOrdinals,
    input.legalHoldFlags,
    "requiredRetentionUntilOrdinals",
  );
  binary(input.legalHoldFlags, "hold");
  const d = input.requiredRetentionUntilOrdinals.map(
    (v, i) => v - input.callerPrivacyDeleteByOrdinals[i],
  );
  return {
    retentionPrivacyConflictFlags: d.map((v) => (v > 0 ? 1 : 0)),
    signedRetentionBeyondDeletionDays: d,
    holdRequiresSeparateReviewFlags: [...input.legalHoldFlags],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredRetentionUntilOrdinals: [30, 20],
  callerPrivacyDeleteByOrdinals: [25, 25],
  legalHoldFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  retentionPrivacyConflictFlags: [1, 0],
  signedRetentionBeyondDeletionDays: [5, -5],
  holdRequiresSeparateReviewFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/gdpr-retention-conflict-flag",
  title: "GDPR-Style Personal Data Retention Conflict Flag Checker",
  description:
    "Audit conflicting independently established retention/deletion deadlines and preserve legal holds for separate review; no GDPR interpretation, precedence resolution or deletion advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "retentionPrivacyConflictFlags",
      label: "Retention privacy conflict flags",
      kind: "numberList",
    },
    {
      id: "signedRetentionBeyondDeletionDays",
      label: "Signed retention beyond deletion days",
      kind: "numberList",
    },
    {
      id: "holdRequiresSeparateReviewFlags",
      label: "Hold requires separate review flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredRetentionUntilOrdinals:
        value.requiredRetentionUntilOrdinals as readonly number[],
      callerPrivacyDeleteByOrdinals:
        value.callerPrivacyDeleteByOrdinals as readonly number[],
      legalHoldFlags: value.legalHoldFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
