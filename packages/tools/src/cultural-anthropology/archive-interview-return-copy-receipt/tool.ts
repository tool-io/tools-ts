import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewId: string;
  readonly copyId: string;
  readonly receiptReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewId: { type: "string", maxLength: 8192, minLength: 1 },
    copyId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interviewId", "copyId", "receiptReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicit archive interview, return-copy and receipt identifiers without establishing delivery or consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewId, copyId, receiptReference } = request;
  const compute = (): Output => {
    H.domain(interviewId.length > 0, "interviewId");
    H.domain(copyId.length > 0, "copyId");
    H.domain(receiptReference.length > 0, "receiptReference");
    return { token: JSON.stringify([interviewId, copyId, receiptReference]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interviewId: "I17", copyId: "C4", receiptReference: "R2" },
  output: { token: '["I17","C4","R2"]' },
} satisfies ToolExample<Input, Output>;
export const archiveInterviewReturnCopyReceiptTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/archive-interview-return-copy-receipt",
    title: "Archive Interview Return Copy Receipt Tool",
    description:
      "Link explicit archive interview, return-copy and receipt identifiers without establishing delivery or consent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interviewId: { type: "string", maxLength: 8192, minLength: 1 },
        copyId: { type: "string", maxLength: 8192, minLength: 1 },
        receiptReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["interviewId", "copyId", "receiptReference"],
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
          id: "interviewId",
          label: "Interview Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "copyId",
          label: "Copy Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "receiptReference",
          label: "Receipt Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = archiveInterviewReturnCopyReceiptTool.execute;
export default archiveInterviewReturnCopyReceiptTool;
