import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly materialId: string;
  readonly certificateId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    materialId: { type: "string", maxLength: 8192, minLength: 1 },
    certificateId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["materialId", "certificateId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit food-contact certificate reference by version without certifying material suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { materialId, certificateId, version } = request;
  const compute = (): Output => {
    H.domain(materialId.length > 0, "materialId");
    H.domain(certificateId.length > 0, "certificateId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([materialId, certificateId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { materialId: "MAT17", certificateId: "CERT2", version: "v2" },
  output: { token: '["MAT17","CERT2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const foodContactCertificateReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/food-contact-certificate-reference",
    title: "Food Contact Certificate Reference",
    description:
      "Qualify an explicit food-contact certificate reference by version without certifying material suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        materialId: { type: "string", maxLength: 8192, minLength: 1 },
        certificateId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["materialId", "certificateId", "version"],
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
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = foodContactCertificateReferenceTool.execute;
export default foodContactCertificateReferenceTool;
