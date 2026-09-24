import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly affectedIds: readonly string[];
  readonly contactedIds: readonly string[];
  readonly declinedIds: readonly string[];
};
export type Output = {
  readonly uncontacted: readonly string[];
  readonly declinedAffected: readonly string[];
  readonly contactedAffected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    affectedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    contactedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    declinedIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["affectedIds", "contactedIds", "declinedIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncontacted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    declinedAffected: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    contactedAffected: { type: "integer" },
  },
  required: ["uncontacted", "declinedAffected", "contactedAffected"],
} as const;
/** Reconcile explicitly supplied recall-contact record identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { affectedIds, contactedIds, declinedIds } = request;
  const compute = (): Output => {
    H.domain(new Set(affectedIds).size === affectedIds.length);
    return {
      uncontacted: affectedIds.filter(
        (x) => !contactedIds.includes(x) && !declinedIds.includes(x),
      ),
      declinedAffected: affectedIds.filter((x) => declinedIds.includes(x)),
      contactedAffected: affectedIds.filter((x) => contactedIds.includes(x))
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    affectedIds: ["A", "B", "C"],
    contactedIds: ["A"],
    declinedIds: ["B"],
  },
  output: { uncontacted: ["C"], declinedAffected: ["B"], contactedAffected: 1 },
} satisfies ToolExample<Input, Output>;
export const communityPharmacyRecallContactCountGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "community-pharmacy/community-pharmacy-recall-contact-count-gap",
      title: "Community Pharmacy Recall Contact Count Gap Tool",
      description:
        "Reconcile explicitly supplied recall-contact record identifiers.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          affectedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          contactedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          declinedIds: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["affectedIds", "contactedIds", "declinedIds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncontacted: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          declinedAffected: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          contactedAffected: { type: "integer" },
        },
        required: ["uncontacted", "declinedAffected", "contactedAffected"],
      },
      ports: {
        inputs: [
          {
            id: "affectedIds",
            label: "Affected Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "contactedIds",
            label: "Contacted Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "declinedIds",
            label: "Declined Ids",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "uncontacted",
            label: "Uncontacted",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "declinedAffected",
            label: "Declined Affected",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "contactedAffected",
            label: "Contacted Affected",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityPharmacyRecallContactCountGapTool.execute;
export default communityPharmacyRecallContactCountGapTool;
