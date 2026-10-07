import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly radiusText: string;
  readonly radiusDefinition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    radiusText: { type: "string", maxLength: 8192, minLength: 1 },
    radiusDefinition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "radiusText", "radiusDefinition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied microscopy PSF radius and its explicit definition without equating different resolution conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, radiusText, radiusDefinition } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(radiusText.length > 0, "radiusText");
    H.domain(radiusDefinition.length > 0, "radiusDefinition");
    return { token: JSON.stringify([imageId, radiusText, radiusDefinition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "I17",
    radiusText: "250 nm",
    radiusDefinition: "first minimum",
  },
  output: { token: '["I17","250 nm","first minimum"]' },
} satisfies ToolExample<Input, Output>;
export const microscopyPsfRadiusReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/microscopy-psf-radius-reference",
    title: "Microscopy PSF Radius Reference",
    description:
      "Preserve a supplied microscopy PSF radius and its explicit definition without equating different resolution conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        radiusText: { type: "string", maxLength: 8192, minLength: 1 },
        radiusDefinition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "radiusText", "radiusDefinition"],
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
          id: "imageId",
          label: "Image Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "radiusText",
          label: "Radius Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "radiusDefinition",
          label: "Radius Definition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = microscopyPsfRadiusReferenceTool.execute;
export default microscopyPsfRadiusReferenceTool;
