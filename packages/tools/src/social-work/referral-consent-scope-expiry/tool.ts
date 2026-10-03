import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purpose: string;
  readonly allowedPurposes: readonly string[];
  readonly withdrawn: boolean;
  readonly queryDay: number;
  readonly expiresDay: number;
  readonly inclusive: boolean;
};
export type Output = {
  readonly scopeMatches: boolean;
  readonly current: boolean;
  readonly eligibleUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purpose: { type: "string", maxLength: 8192 },
    allowedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    withdrawn: { type: "boolean" },
    queryDay: { type: "integer" },
    expiresDay: { type: "integer" },
    inclusive: { type: "boolean" },
  },
  required: [
    "purpose",
    "allowedPurposes",
    "withdrawn",
    "queryDay",
    "expiresDay",
    "inclusive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeMatches: { type: "boolean" },
    current: { type: "boolean" },
    eligibleUnderFlags: { type: "boolean" },
  },
  required: ["scopeMatches", "current", "eligibleUnderFlags"],
} as const;
/** Evaluate supplied purpose and expiry flags; no legal consent authority is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    purpose,
    allowedPurposes,
    withdrawn,
    queryDay,
    expiresDay,
    inclusive,
  } = request;
  const compute = (): Output => {
    const scopeMatches = allowedPurposes.includes(purpose),
      current =
        !withdrawn &&
        (inclusive ? queryDay <= expiresDay : queryDay < expiresDay);
    return {
      scopeMatches,
      current,
      eligibleUnderFlags: scopeMatches && current,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purpose: "housing",
    allowedPurposes: ["housing"],
    withdrawn: false,
    queryDay: 10,
    expiresDay: 10,
    inclusive: true,
  },
  output: { scopeMatches: true, current: true, eligibleUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const referralConsentScopeExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/referral-consent-scope-expiry",
    title: "Referral Consent Scope Expiry Tool",
    description:
      "Evaluate supplied purpose and expiry flags; no legal consent authority is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purpose: { type: "string", maxLength: 8192 },
        allowedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        withdrawn: { type: "boolean" },
        queryDay: { type: "integer" },
        expiresDay: { type: "integer" },
        inclusive: { type: "boolean" },
      },
      required: [
        "purpose",
        "allowedPurposes",
        "withdrawn",
        "queryDay",
        "expiresDay",
        "inclusive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scopeMatches: { type: "boolean" },
        current: { type: "boolean" },
        eligibleUnderFlags: { type: "boolean" },
      },
      required: ["scopeMatches", "current", "eligibleUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "purpose",
          label: "Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedPurposes",
          label: "Allowed Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "withdrawn",
          label: "Withdrawn",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "queryDay",
          label: "Query Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiresDay",
          label: "Expires Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "scopeMatches",
          label: "Scope Matches",
          valueType: { type: "boolean" },
        },
        { id: "current", label: "Current", valueType: { type: "boolean" } },
        {
          id: "eligibleUnderFlags",
          label: "Eligible Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = referralConsentScopeExpiryTool.execute;
export default referralConsentScopeExpiryTool;
