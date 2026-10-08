import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly termId: string;
  readonly permissionToPublish: boolean;
  readonly suppliedRestrictionCode: string;
};
export type Output = {
  readonly publicationRestricted: boolean;
  readonly restrictionRecord: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    termId: { type: "string", maxLength: 8192, minLength: 1 },
    permissionToPublish: { type: "boolean" },
    suppliedRestrictionCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["termId", "permissionToPublish", "suppliedRestrictionCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationRestricted: { type: "boolean" },
    restrictionRecord: { type: "string", maxLength: 8192 },
  },
  required: ["publicationRestricted", "restrictionRecord"],
} as const;
/** Expose an explicit community-term publication permission flag and associated restriction record without granting rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { termId, permissionToPublish, suppliedRestrictionCode } = request;
  const compute = (): Output => {
    H.domain(termId.length > 0, "termId");
    H.domain(suppliedRestrictionCode.length > 0, "suppliedRestrictionCode");
    return {
      publicationRestricted: !permissionToPublish,
      restrictionRecord: JSON.stringify([termId, suppliedRestrictionCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    termId: "T17",
    permissionToPublish: false,
    suppliedRestrictionCode: "community request",
  },
  output: {
    publicationRestricted: true,
    restrictionRecord: '["T17","community request"]',
  },
} satisfies ToolExample<Input, Output>;
export const communityTermRestrictedPublicationFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cultural-anthropology/community-term-restricted-publication-flag",
      title: "Community Term Restricted Publication Flag Tool",
      description:
        "Expose an explicit community-term publication permission flag and associated restriction record without granting rights.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          termId: { type: "string", maxLength: 8192, minLength: 1 },
          permissionToPublish: { type: "boolean" },
          suppliedRestrictionCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["termId", "permissionToPublish", "suppliedRestrictionCode"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicationRestricted: { type: "boolean" },
          restrictionRecord: { type: "string", maxLength: 8192 },
        },
        required: ["publicationRestricted", "restrictionRecord"],
      },
      ports: {
        inputs: [
          {
            id: "termId",
            label: "Term Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionToPublish",
            label: "Permission To Publish",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "suppliedRestrictionCode",
            label: "Supplied Restriction Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "publicationRestricted",
            label: "Publication Restricted",
            valueType: { type: "boolean" },
          },
          {
            id: "restrictionRecord",
            label: "Restriction Record",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityTermRestrictedPublicationFlagTool.execute;
export default communityTermRestrictedPublicationFlagTool;
