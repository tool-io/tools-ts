import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly motherPurposes: readonly string[];
  readonly infantPurposes: readonly string[];
  readonly requestedPurpose: string;
  readonly motherAudience: readonly string[];
  readonly infantAudience: readonly string[];
  readonly requestedAudience: string;
  readonly motherWithdrawn: boolean;
  readonly infantWithdrawn: boolean;
};
export type Output = {
  readonly purposeAllowed: boolean;
  readonly audienceAllowed: boolean;
  readonly eligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    motherPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    infantPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedPurpose: { type: "string", maxLength: 8192 },
    motherAudience: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    infantAudience: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedAudience: { type: "string", maxLength: 8192 },
    motherWithdrawn: { type: "boolean" },
    infantWithdrawn: { type: "boolean" },
  },
  required: [
    "motherPurposes",
    "infantPurposes",
    "requestedPurpose",
    "motherAudience",
    "infantAudience",
    "requestedAudience",
    "motherWithdrawn",
    "infantWithdrawn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposeAllowed: { type: "boolean" },
    audienceAllowed: { type: "boolean" },
    eligible: { type: "boolean" },
  },
  required: ["purposeAllowed", "audienceAllowed", "eligible"],
} as const;
/** Check both supplied record linkage scopes and withdrawal flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    motherPurposes,
    infantPurposes,
    requestedPurpose,
    motherAudience,
    infantAudience,
    requestedAudience,
    motherWithdrawn,
    infantWithdrawn,
  } = request;
  const compute = (): Output => {
    H.domain(
      requestedPurpose.length > 0 && requestedAudience.length > 0,
      "requestedPurpose",
    );
    const purposeAllowed =
        motherPurposes.includes(requestedPurpose) &&
        infantPurposes.includes(requestedPurpose),
      audienceAllowed =
        motherAudience.includes(requestedAudience) &&
        infantAudience.includes(requestedAudience);
    return {
      purposeAllowed,
      audienceAllowed,
      eligible:
        purposeAllowed &&
        audienceAllowed &&
        !motherWithdrawn &&
        !infantWithdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    motherPurposes: ["study"],
    infantPurposes: ["study"],
    requestedPurpose: "study",
    motherAudience: ["team"],
    infantAudience: ["team"],
    requestedAudience: "team",
    motherWithdrawn: false,
    infantWithdrawn: false,
  },
  output: { purposeAllowed: true, audienceAllowed: true, eligible: true },
} satisfies ToolExample<Input, Output>;
export const maternityDataMotherInfantLinkScopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/maternity-data-mother-infant-link-scope",
    title: "Maternity Data Mother Infant Link Scope Tool",
    description:
      "Check both supplied record linkage scopes and withdrawal flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        motherPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        infantPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedPurpose: { type: "string", maxLength: 8192 },
        motherAudience: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        infantAudience: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedAudience: { type: "string", maxLength: 8192 },
        motherWithdrawn: { type: "boolean" },
        infantWithdrawn: { type: "boolean" },
      },
      required: [
        "motherPurposes",
        "infantPurposes",
        "requestedPurpose",
        "motherAudience",
        "infantAudience",
        "requestedAudience",
        "motherWithdrawn",
        "infantWithdrawn",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purposeAllowed: { type: "boolean" },
        audienceAllowed: { type: "boolean" },
        eligible: { type: "boolean" },
      },
      required: ["purposeAllowed", "audienceAllowed", "eligible"],
    },
    ports: {
      inputs: [
        {
          id: "motherPurposes",
          label: "Mother Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "infantPurposes",
          label: "Infant Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedPurpose",
          label: "Requested Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "motherAudience",
          label: "Mother Audience",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "infantAudience",
          label: "Infant Audience",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedAudience",
          label: "Requested Audience",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "motherWithdrawn",
          label: "Mother Withdrawn",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "infantWithdrawn",
          label: "Infant Withdrawn",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "purposeAllowed",
          label: "Purpose Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "audienceAllowed",
          label: "Audience Allowed",
          valueType: { type: "boolean" },
        },
        { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = maternityDataMotherInfantLinkScopeTool.execute;
export default maternityDataMotherInfantLinkScopeTool;
