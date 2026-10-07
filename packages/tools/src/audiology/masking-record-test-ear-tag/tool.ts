import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly testEar: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    testEar: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "bilateral", "unspecified"],
    },
  },
  required: ["recordId", "testEar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied audiology masking record by explicit test-ear metadata without selecting masking levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, testEar } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["left", "right", "bilateral", "unspecified"].includes(testEar),
      "testEar",
    );
    return { label: recordId + " [" + testEar + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", testEar: "left" },
  output: { label: "R17 [left]" },
} satisfies ToolExample<Input, Output>;
export const maskingRecordTestEarTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/masking-record-test-ear-tag",
    title: "Masking Record Test Ear Tag",
    description:
      "Label a supplied audiology masking record by explicit test-ear metadata without selecting masking levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        testEar: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "bilateral", "unspecified"],
        },
      },
      required: ["recordId", "testEar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
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
          id: "testEar",
          label: "Test Ear",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = maskingRecordTestEarTagTool.execute;
export default maskingRecordTestEarTagTool;
