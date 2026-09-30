import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linkId: string;
  readonly expectedLinkId: string;
  readonly approvedPurposes: readonly string[];
  readonly requestedPurpose: string;
  readonly audience: string;
  readonly approvedAudiences: readonly string[];
  readonly revoked: boolean;
};
export type Output = {
  readonly linkMatches: boolean;
  readonly purposeMatches: boolean;
  readonly audienceMatches: boolean;
  readonly eligible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linkId: { type: "string", maxLength: 8192 },
    expectedLinkId: { type: "string", maxLength: 8192 },
    approvedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedPurpose: { type: "string", maxLength: 8192 },
    audience: { type: "string", maxLength: 8192 },
    approvedAudiences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    revoked: { type: "boolean" },
  },
  required: [
    "linkId",
    "expectedLinkId",
    "approvedPurposes",
    "requestedPurpose",
    "audience",
    "approvedAudiences",
    "revoked",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linkMatches: { type: "boolean" },
    purposeMatches: { type: "boolean" },
    audienceMatches: { type: "boolean" },
    eligible: { type: "boolean" },
  },
  required: ["linkMatches", "purposeMatches", "audienceMatches", "eligible"],
} as const;
/** Validate supplied permissions on an existing linkage identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    linkId,
    expectedLinkId,
    approvedPurposes,
    requestedPurpose,
    audience,
    approvedAudiences,
    revoked,
  } = request;
  const compute = (): Output => {
    H.domain(
      linkId.length > 0 &&
        expectedLinkId.length > 0 &&
        requestedPurpose.length > 0 &&
        audience.length > 0,
    );
    const linkMatches = linkId === expectedLinkId,
      purposeMatches = approvedPurposes.includes(requestedPurpose),
      audienceMatches = approvedAudiences.includes(audience);
    return {
      linkMatches,
      purposeMatches,
      audienceMatches,
      eligible: linkMatches && purposeMatches && audienceMatches && !revoked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    linkId: "L1",
    expectedLinkId: "L1",
    approvedPurposes: ["audit"],
    requestedPurpose: "audit",
    audience: "team",
    approvedAudiences: ["team"],
    revoked: false,
  },
  output: {
    linkMatches: true,
    purposeMatches: true,
    audienceMatches: true,
    eligible: true,
  },
} satisfies ToolExample<Input, Output>;
export const midwiferyStudyMotherInfantIdScopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/midwifery-study-mother-infant-id-scope",
    title: "Midwifery Study Mother Infant ID Scope Tool",
    description:
      "Validate supplied permissions on an existing linkage identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linkId: { type: "string", maxLength: 8192 },
        expectedLinkId: { type: "string", maxLength: 8192 },
        approvedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedPurpose: { type: "string", maxLength: 8192 },
        audience: { type: "string", maxLength: 8192 },
        approvedAudiences: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        revoked: { type: "boolean" },
      },
      required: [
        "linkId",
        "expectedLinkId",
        "approvedPurposes",
        "requestedPurpose",
        "audience",
        "approvedAudiences",
        "revoked",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linkMatches: { type: "boolean" },
        purposeMatches: { type: "boolean" },
        audienceMatches: { type: "boolean" },
        eligible: { type: "boolean" },
      },
      required: [
        "linkMatches",
        "purposeMatches",
        "audienceMatches",
        "eligible",
      ],
    },
    ports: {
      inputs: [
        {
          id: "linkId",
          label: "Link Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedLinkId",
          label: "Expected Link Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedPurposes",
          label: "Approved Purposes",
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
          id: "audience",
          label: "Audience",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "approvedAudiences",
          label: "Approved Audiences",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "revoked",
          label: "Revoked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "linkMatches",
          label: "Link Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "purposeMatches",
          label: "Purpose Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "audienceMatches",
          label: "Audience Matches",
          valueType: { type: "boolean" },
        },
        { id: "eligible", label: "Eligible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = midwiferyStudyMotherInfantIdScopeTool.execute;
export default midwiferyStudyMotherInfantIdScopeTool;
