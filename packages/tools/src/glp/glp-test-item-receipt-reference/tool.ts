import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly testItemId: string;
  readonly receiptRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    testItemId: { type: "string", maxLength: 8192, minLength: 1 },
    receiptRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "testItemId", "receiptRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicit test-item and receipt identifiers without verifying identity or receipt conditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, testItemId, receiptRecordId } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(testItemId.length > 0, "testItemId");
    H.domain(receiptRecordId.length > 0, "receiptRecordId");
    return { token: JSON.stringify([studyId, testItemId, receiptRecordId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", testItemId: "ITEM2", receiptRecordId: "REC2" },
  output: { token: '["ST17","ITEM2","REC2"]' },
} satisfies ToolExample<Input, Output>;
export const glpTestItemReceiptReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "glp",
        "good laboratory practice",
        "research and quality management",
      ],
      keywords: [
        "good laboratory practice",
        "research and quality management",
        "GLP",
      ],
    },
    id: "glp/glp-test-item-receipt-reference",
    title: "GLP Test Item Receipt Reference",
    description:
      "Link explicit test-item and receipt identifiers without verifying identity or receipt conditions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        testItemId: { type: "string", maxLength: 8192, minLength: 1 },
        receiptRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "testItemId", "receiptRecordId"],
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
          id: "studyId",
          label: "Study Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "testItemId",
          label: "Test Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "receiptRecordId",
          label: "Receipt Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpTestItemReceiptReferenceTool.execute;
export default glpTestItemReceiptReferenceTool;
