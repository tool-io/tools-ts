import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batchId: string;
  readonly fieldName: string;
  readonly printedValue: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
    fieldName: { type: "string", maxLength: 8192, minLength: 1 },
    printedValue: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["batchId", "fieldName", "printedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit batch-label field and its printed value without authenticating the product. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchId, fieldName, printedValue } = request;
  const compute = (): Output => {
    H.domain(batchId.length > 0, "batchId");
    H.domain(fieldName.length > 0, "fieldName");
    H.domain(printedValue.length > 0, "printedValue");
    return { token: JSON.stringify([batchId, fieldName, printedValue]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batchId: "B17", fieldName: "lot", printedValue: "L42" },
  output: { token: '["B17","lot","L42"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathyBatchLabelFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-batch-label-field",
    title: "Homeopathy Batch Label Field",
    description:
      "Preserve an explicit batch-label field and its printed value without authenticating the product.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        batchId: { type: "string", maxLength: 8192, minLength: 1 },
        fieldName: { type: "string", maxLength: 8192, minLength: 1 },
        printedValue: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["batchId", "fieldName", "printedValue"],
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
          id: "batchId",
          label: "Batch Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fieldName",
          label: "Field Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printedValue",
          label: "Printed Value",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeopathyBatchLabelFieldTool.execute;
export default homeopathyBatchLabelFieldTool;
