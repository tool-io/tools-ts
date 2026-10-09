import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly materialId: string;
  readonly certificateId: string;
  readonly certificateVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    materialId: { type: "string", maxLength: 8192, minLength: 1 },
    certificateId: { type: "string", maxLength: 8192, minLength: 1 },
    certificateVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["materialId", "certificateId", "certificateVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit reference-material certificate identifier without verifying certification or traceability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { materialId, certificateId, certificateVersion } = request;
  const compute = (): Output => {
    H.domain(materialId.length > 0, "materialId");
    H.domain(certificateId.length > 0, "certificateId");
    H.domain(certificateVersion.length > 0, "certificateVersion");
    return {
      token: JSON.stringify([materialId, certificateId, certificateVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    materialId: "RM17",
    certificateId: "CERT-4",
    certificateVersion: "v2",
  },
  output: { token: '["RM17","CERT-4","v2"]' },
} satisfies ToolExample<Input, Output>;
export const forensicReferenceCertificateIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/forensic-reference-certificate-id",
    title: "Forensic Reference Certificate ID",
    description:
      "Qualify an explicit reference-material certificate identifier without verifying certification or traceability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        materialId: { type: "string", maxLength: 8192, minLength: 1 },
        certificateId: { type: "string", maxLength: 8192, minLength: 1 },
        certificateVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["materialId", "certificateId", "certificateVersion"],
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
          id: "materialId",
          label: "Material Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "certificateId",
          label: "Certificate Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "certificateVersion",
          label: "Certificate Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = forensicReferenceCertificateIdTool.execute;
export default forensicReferenceCertificateIdTool;
