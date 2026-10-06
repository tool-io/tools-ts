import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly originalCaseId: string;
  readonly reopeningReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    originalCaseId: { type: "string", maxLength: 8192, minLength: 1 },
    reopeningReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "originalCaseId", "reopeningReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an explicit reopened case reference and supplied reason without evaluating procedure rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, originalCaseId, reopeningReason } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(originalCaseId.length > 0, "originalCaseId");
    H.domain(reopeningReason.length > 0, "reopeningReason");
    return { token: JSON.stringify([caseId, originalCaseId, reopeningReason]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseId: "C17",
    originalCaseId: "C4",
    reopeningReason: "new evidence",
  },
  output: { token: '["C17","C4","new evidence"]' },
} satisfies ToolExample<Input, Output>;
export const caseReopenedOriginalReferenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/case-reopened-original-reference-tag",
    title: "Case Reopened Original Reference Tag",
    description:
      "Encode an explicit reopened case reference and supplied reason without evaluating procedure rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        originalCaseId: { type: "string", maxLength: 8192, minLength: 1 },
        reopeningReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "originalCaseId", "reopeningReason"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "caseId",
          label: "Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalCaseId",
          label: "Original Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reopeningReason",
          label: "Reopening Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caseReopenedOriginalReferenceTagTool.execute;
export default caseReopenedOriginalReferenceTagTool;
