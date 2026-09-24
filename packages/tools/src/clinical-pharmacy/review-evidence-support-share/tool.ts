import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewItems: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly verifiedEvidenceIds: readonly string[];
  readonly applicable: readonly boolean[];
};
export type Output = {
  readonly applicableItems: number;
  readonly supportedItems: number;
  readonly missingEvidenceItems: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewItems: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    evidenceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiedEvidenceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    applicable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["reviewItems", "evidenceIds", "verifiedEvidenceIds", "applicable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicableItems: { type: "integer" },
    supportedItems: { type: "integer" },
    missingEvidenceItems: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "applicableItems",
    "supportedItems",
    "missingEvidenceItems",
    "share",
    "defined",
  ],
} as const;
/** Calculate review evidence support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewItems, evidenceIds, verifiedEvidenceIds, applicable } = request;
  const compute = (): Output => {
    H.sameLength(reviewItems, evidenceIds);
    H.sameLength(reviewItems, applicable);
    H.domain(new Set(reviewItems).size === reviewItems.length);
    return (() => {
      const applicableItems = applicable.filter(Boolean).length,
        supportedItems = applicable.filter(
          (x, i) =>
            x &&
            evidenceIds[i].length > 0 &&
            verifiedEvidenceIds.includes(evidenceIds[i]),
        ).length;
      return {
        applicableItems,
        supportedItems,
        missingEvidenceItems: applicable.filter(
          (x, i) => x && evidenceIds[i].length === 0,
        ).length,
        share: applicableItems ? supportedItems / applicableItems : 0,
        defined: applicableItems > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reviewItems: ["a", "b"],
    evidenceIds: ["e1", ""],
    verifiedEvidenceIds: ["e1"],
    applicable: [true, true],
  },
  output: {
    applicableItems: 2,
    supportedItems: 1,
    missingEvidenceItems: 1,
    share: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const reviewEvidenceSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/review-evidence-support-share",
    title: "Review Evidence Support Share Tool",
    description:
      "Calculate review evidence support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewItems: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        evidenceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        verifiedEvidenceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        applicable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "reviewItems",
        "evidenceIds",
        "verifiedEvidenceIds",
        "applicable",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicableItems: { type: "integer" },
        supportedItems: { type: "integer" },
        missingEvidenceItems: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "applicableItems",
        "supportedItems",
        "missingEvidenceItems",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "reviewItems",
          label: "Review Items",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "evidenceIds",
          label: "Evidence Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "verifiedEvidenceIds",
          label: "Verified Evidence Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "applicable",
          label: "Applicable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "applicableItems",
          label: "Applicable Items",
          valueType: { type: "integer" },
        },
        {
          id: "supportedItems",
          label: "Supported Items",
          valueType: { type: "integer" },
        },
        {
          id: "missingEvidenceItems",
          label: "Missing Evidence Items",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = reviewEvidenceSupportShareTool.execute;
export default reviewEvidenceSupportShareTool;
