import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GiftsHospitalityInput = {
  readonly approvalDocumented: boolean;
  readonly cash: boolean;
  readonly giftValue: number;
  readonly policyThreshold: number;
  readonly recipientIsClientPersonnel: boolean;
};

export type GiftsHospitalityOutput = {
  readonly compliant: boolean;
  readonly policyReviewRequired: boolean;
  readonly riskFactors: ReadonlyArray<string>;
};

export const assessGiftsHospitalityPolicy = (
  input: GiftsHospitalityInput,
): GiftsHospitalityOutput => {
  for (const [field, value] of [
    ["giftValue", input.giftValue],
    ["policyThreshold", input.policyThreshold],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_gift_value",
      );
  for (const field of [
    "approvalDocumented",
    "cash",
    "recipientIsClientPersonnel",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  const riskFactors: string[] = [];
  if (input.giftValue >= input.policyThreshold)
    riskFactors.push("threshold_reached");
  if (input.cash) riskFactors.push("cash_gift");
  if (input.recipientIsClientPersonnel)
    riskFactors.push("client_personnel_recipient");
  const policyReviewRequired = riskFactors.length > 0;
  return {
    compliant: !policyReviewRequired || input.approvalDocumented,
    policyReviewRequired,
    riskFactors,
  };
};

export const giftsHospitalityExample = {
  input: {
    approvalDocumented: false,
    cash: true,
    giftValue: 250,
    policyThreshold: 100,
    recipientIsClientPersonnel: true,
  },
  output: {
    compliant: false,
    policyReviewRequired: true,
    riskFactors: [
      "threshold_reached",
      "cash_gift",
      "client_personnel_recipient",
    ],
  },
} satisfies ToolExample<GiftsHospitalityInput, GiftsHospitalityOutput>;

export const giftsHospitalityTool = createSimpleTool({
  calculate: (input) =>
    assessGiftsHospitalityPolicy({
      approvalDocumented: input.approvalDocumented as boolean,
      cash: input.cash as boolean,
      giftValue: input.giftValue as number,
      policyThreshold: input.policyThreshold as number,
      recipientIsClientPersonnel: input.recipientIsClientPersonnel as boolean,
    }),
  description:
    "Apply a caller-supplied gifts-and-hospitality threshold and approval fact to supplied value, cash, and client-personnel indicators.",
  id: "auditing/gifts-hospitality-threshold-firm-policy-lookup",
  inputs: [
    { id: "approvalDocumented", kind: "boolean", label: "Approval documented" },
    { id: "cash", kind: "boolean", label: "Cash gift" },
    { id: "giftValue", kind: "number", label: "Gift value", minimum: 0 },
    {
      id: "policyThreshold",
      kind: "number",
      label: "Policy threshold",
      minimum: 0,
    },
    {
      id: "recipientIsClientPersonnel",
      kind: "boolean",
      label: "Recipient is client personnel",
    },
  ],
  outputs: [
    { id: "compliant", kind: "boolean", label: "Policy requirement satisfied" },
    {
      id: "policyReviewRequired",
      kind: "boolean",
      label: "Policy review required",
    },
    { id: "riskFactors", kind: "stringList", label: "Risk factors" },
  ],
  title: "Gifts Hospitality Threshold Firm Policy Lookup",
});

export const runGiftsHospitality = giftsHospitalityTool.execute;
export default giftsHospitalityTool;
