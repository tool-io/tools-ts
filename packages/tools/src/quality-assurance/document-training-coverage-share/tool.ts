import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredDocumentIds: readonly string[];
  readonly trainedDocumentIds: readonly string[];
};
export type Output = {
  readonly requiredCount: number;
  readonly coveredCount: number;
  readonly missingDocumentIds: readonly string[];
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredDocumentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trainedDocumentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredDocumentIds", "trainedDocumentIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    coveredCount: { type: "integer" },
    missingDocumentIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "requiredCount",
    "coveredCount",
    "missingDocumentIds",
    "share",
    "defined",
  ],
} as const;
/** Audit supplied document-training identifier coverage without certifying personnel qualification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredDocumentIds, trainedDocumentIds } = request;
  const compute = (): Output => {
    const ids = [...new Set(requiredDocumentIds)],
      missingDocumentIds = ids.filter((x) => !trainedDocumentIds.includes(x)),
      requiredCount = ids.length,
      coveredCount = requiredCount - missingDocumentIds.length;
    return {
      requiredCount,
      coveredCount,
      missingDocumentIds,
      share: requiredCount ? coveredCount / requiredCount : 0,
      defined: requiredCount > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredDocumentIds: ["A", "B", "C"],
    trainedDocumentIds: ["A", "C"],
  },
  output: {
    requiredCount: 3,
    coveredCount: 2,
    missingDocumentIds: ["B"],
    share: 0.6666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const documentTrainingCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/document-training-coverage-share",
    title: "Document Training Coverage Share Tool",
    description:
      "Audit supplied document-training identifier coverage without certifying personnel qualification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredDocumentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        trainedDocumentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredDocumentIds", "trainedDocumentIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer" },
        coveredCount: { type: "integer" },
        missingDocumentIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "requiredCount",
        "coveredCount",
        "missingDocumentIds",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "requiredDocumentIds",
          label: "Required Document Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "trainedDocumentIds",
          label: "Trained Document Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "coveredCount",
          label: "Covered Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingDocumentIds",
          label: "Missing Document Ids",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = documentTrainingCoverageShareTool.execute;
export default documentTrainingCoverageShareTool;
