import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly sourceFieldId: string;
  readonly verificationWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceFieldId: { type: "string", maxLength: 8192, minLength: 1 },
    verificationWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "sourceFieldId", "verificationWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit source-field verification tag without performing verification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, sourceFieldId, verificationWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(sourceFieldId.length > 0, "sourceFieldId");
    H.domain(verificationWording.length > 0, "verificationWording");
    return {
      token: JSON.stringify([recordId, sourceFieldId, verificationWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    sourceFieldId: "F2",
    verificationWording: "verified record",
  },
  output: { token: '["R17","F2","verified record"]' },
} satisfies ToolExample<Input, Output>;
export const gcpSourceFieldVerificationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-source-field-verification-tag",
    title: "GCP Source Field Verification Tag",
    description:
      "Preserve an explicit source-field verification tag without performing verification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceFieldId: { type: "string", maxLength: 8192, minLength: 1 },
        verificationWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "sourceFieldId", "verificationWording"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceFieldId",
          label: "Source Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "verificationWording",
          label: "Verification Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gcpSourceFieldVerificationTagTool.execute;
export default gcpSourceFieldVerificationTagTool;
