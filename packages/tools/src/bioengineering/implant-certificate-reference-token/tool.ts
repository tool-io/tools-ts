import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceRecordId: string;
  readonly certificateReference: string;
  readonly issuerCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    certificateReference: { type: "string", maxLength: 8192, minLength: 1 },
    issuerCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceRecordId", "certificateReference", "issuerCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode explicit device-record and certificate-reference fields without verifying certification or implant suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceRecordId, certificateReference, issuerCode } = request;
  const compute = (): Output => {
    H.domain(
      deviceRecordId.length > 0 &&
        certificateReference.length > 0 &&
        issuerCode.length > 0,
      "deviceRecordId",
    );
    return {
      token: JSON.stringify([deviceRecordId, issuerCode, certificateReference]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceRecordId: "D17",
    certificateReference: "CERT42",
    issuerCode: "ISS-A",
  },
  output: { token: '["D17","ISS-A","CERT42"]' },
} satisfies ToolExample<Input, Output>;
export const implantCertificateReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/implant-certificate-reference-token",
    title: "Implant Certificate Reference Token",
    description:
      "Encode explicit device-record and certificate-reference fields without verifying certification or implant suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        certificateReference: { type: "string", maxLength: 8192, minLength: 1 },
        issuerCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceRecordId", "certificateReference", "issuerCode"],
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
          id: "deviceRecordId",
          label: "Device Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "certificateReference",
          label: "Certificate Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issuerCode",
          label: "Issuer Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = implantCertificateReferenceTokenTool.execute;
export default implantCertificateReferenceTokenTool;
