import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly parentId: string;
  readonly reason: string;
  readonly authorId: string;
  readonly originalTimestamp: number;
  readonly editTimestamp: number;
};
export type Output = {
  readonly linked: boolean;
  readonly reasonPresent: boolean;
  readonly attributed: boolean;
  readonly chronological: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192 },
    parentId: { type: "string", maxLength: 8192 },
    reason: { type: "string", maxLength: 8192 },
    authorId: { type: "string", maxLength: 8192 },
    originalTimestamp: { type: "number" },
    editTimestamp: { type: "number" },
  },
  required: [
    "recordId",
    "parentId",
    "reason",
    "authorId",
    "originalTimestamp",
    "editTimestamp",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    reasonPresent: { type: "boolean" },
    attributed: { type: "boolean" },
    chronological: { type: "boolean" },
  },
  required: ["linked", "reasonPresent", "attributed", "chronological"],
} as const;
/** Audit explicit eCRF edit attribution and chronology without rewriting records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordId,
    parentId,
    reason,
    authorId,
    originalTimestamp,
    editTimestamp,
  } = request;
  const compute = (): Output => {
    return {
      linked: recordId === parentId,
      reasonPresent: reason.trim().length > 0,
      attributed: authorId.length > 0,
      chronological: editTimestamp >= originalTimestamp,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R1",
    parentId: "R1",
    reason: "typo",
    authorId: "A",
    originalTimestamp: 100,
    editTimestamp: 105,
  },
  output: {
    linked: true,
    reasonPresent: true,
    attributed: true,
    chronological: true,
  },
} satisfies ToolExample<Input, Output>;
export const gcpEcrfEditOriginalCorrectionLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-ecrf-edit-original-correction-link",
    title: "GCP Ecrf Edit Original Correction Link Tool",
    description:
      "Audit explicit eCRF edit attribution and chronology without rewriting records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192 },
        parentId: { type: "string", maxLength: 8192 },
        reason: { type: "string", maxLength: 8192 },
        authorId: { type: "string", maxLength: 8192 },
        originalTimestamp: { type: "number" },
        editTimestamp: { type: "number" },
      },
      required: [
        "recordId",
        "parentId",
        "reason",
        "authorId",
        "originalTimestamp",
        "editTimestamp",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        reasonPresent: { type: "boolean" },
        attributed: { type: "boolean" },
        chronological: { type: "boolean" },
      },
      required: ["linked", "reasonPresent", "attributed", "chronological"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentId",
          label: "Parent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reason",
          label: "Reason",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorId",
          label: "Author Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalTimestamp",
          label: "Original Timestamp",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "editTimestamp",
          label: "Edit Timestamp",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "reasonPresent",
          label: "Reason Present",
          valueType: { type: "boolean" },
        },
        {
          id: "attributed",
          label: "Attributed",
          valueType: { type: "boolean" },
        },
        {
          id: "chronological",
          label: "Chronological",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpEcrfEditOriginalCorrectionLinkTool.execute;
export default gcpEcrfEditOriginalCorrectionLinkTool;
