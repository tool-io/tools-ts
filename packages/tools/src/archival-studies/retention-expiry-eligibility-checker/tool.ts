import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, binary } from "../shared.js";
export type Input = Readonly<{
  readonly declaredRetentionExpiryOrdinals: readonly number[];
  readonly legalHoldFlags: readonly number[];
  readonly requiredReviewCompleteFlags: readonly number[];
  readonly asOfDayOrdinal: number;
}>;
export type Output = Readonly<{
  readonly expiredRecordFlags: readonly number[];
  readonly callerEligibilityFlags: readonly number[];
  readonly holdBlockedExpiredCount: number;
}>;
const inputFields = [
  {
    id: "declaredRetentionExpiryOrdinals",
    label: "Declared retention expiry ordinals",
    kind: "numberList",
  },
  { id: "legalHoldFlags", label: "Legal hold flags", kind: "numberList" },
  {
    id: "requiredReviewCompleteFlags",
    label: "Required review complete flags",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.declaredRetentionExpiryOrdinals.forEach((v) =>
    count(v, "declaredRetentionExpiryOrdinals"),
  );
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  aligned(
    input.declaredRetentionExpiryOrdinals,
    input.legalHoldFlags,
    "declaredRetentionExpiryOrdinals",
  );
  aligned(
    input.declaredRetentionExpiryOrdinals,
    input.requiredReviewCompleteFlags,
    "declaredRetentionExpiryOrdinals",
  );
  binary(input.legalHoldFlags, "hold");
  binary(input.requiredReviewCompleteFlags, "review");
  const expired = input.declaredRetentionExpiryOrdinals.map((v) =>
    v <= input.asOfDayOrdinal ? 1 : 0,
  );
  return {
    expiredRecordFlags: expired,
    callerEligibilityFlags: expired.map((v, i) =>
      v && !input.legalHoldFlags[i] && input.requiredReviewCompleteFlags[i]
        ? 1
        : 0,
    ),
    holdBlockedExpiredCount: expired.reduce<number>(
      (s, v, i) => s + v * input.legalHoldFlags[i],
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  declaredRetentionExpiryOrdinals: [10, 20, 30],
  legalHoldFlags: [0, 1, 0],
  requiredReviewCompleteFlags: [1, 1, 1],
  asOfDayOrdinal: 25,
} satisfies Input;
export const exampleOutput = {
  expiredRecordFlags: [1, 1, 0],
  callerEligibilityFlags: [1, 0, 0],
  holdBlockedExpiredCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/retention-expiry-eligibility-checker",
  title: "Retention Period Expiry Eligibility Checker",
  description:
    "Separate declared expiry from caller hold/review gating, preserving expired-but-held records; eligibility flags are workflow policy, not lawful destruction permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "expiredRecordFlags",
      label: "Expired record flags",
      kind: "numberList",
    },
    {
      id: "callerEligibilityFlags",
      label: "Caller eligibility flags",
      kind: "numberList",
    },
    {
      id: "holdBlockedExpiredCount",
      label: "Hold blocked expired count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      declaredRetentionExpiryOrdinals:
        value.declaredRetentionExpiryOrdinals as readonly number[],
      legalHoldFlags: value.legalHoldFlags as readonly number[],
      requiredReviewCompleteFlags:
        value.requiredReviewCompleteFlags as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
