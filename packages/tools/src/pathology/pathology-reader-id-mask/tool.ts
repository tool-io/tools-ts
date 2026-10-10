import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly readerId: string;
  readonly publishReaderId: boolean;
  readonly maskedLabel: string;
};
export type Output = { readonly displayId: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readerId: { type: "string", maxLength: 8192, minLength: 1 },
    publishReaderId: { type: "boolean" },
    maskedLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["readerId", "publishReaderId", "maskedLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayId: { type: "string", maxLength: 8192 } },
  required: ["displayId"],
} as const;
/** Apply an explicit reader-identifier display choice without inferring anonymity policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { readerId, publishReaderId, maskedLabel } = request;
  const compute = (): Output => {
    H.domain(readerId.length > 0 && maskedLabel.length > 0, "readerId");
    return { displayId: publishReaderId ? readerId : maskedLabel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    readerId: "RATER17",
    publishReaderId: false,
    maskedLabel: "Reader A",
  },
  output: { displayId: "Reader A" },
} satisfies ToolExample<Input, Output>;
export const pathologyReaderIdMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/pathology-reader-id-mask",
    title: "Pathology Reader ID Mask",
    description:
      "Apply an explicit reader-identifier display choice without inferring anonymity policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readerId: { type: "string", maxLength: 8192, minLength: 1 },
        publishReaderId: { type: "boolean" },
        maskedLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["readerId", "publishReaderId", "maskedLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayId: { type: "string", maxLength: 8192 } },
      required: ["displayId"],
    },
    ports: {
      inputs: [
        {
          id: "readerId",
          label: "Reader Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publishReaderId",
          label: "Publish Reader Id",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "maskedLabel",
          label: "Masked Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "displayId", label: "Display Id", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = pathologyReaderIdMaskTool.execute;
export default pathologyReaderIdMaskTool;
