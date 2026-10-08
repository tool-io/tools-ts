import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly purposeCode: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: ["imageId", "purposeCode", "permissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicitly recorded skin-image purpose permission without establishing valid consent or authorizing disclosure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, purposeCode, permissionRecorded } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0 && purposeCode.length > 0, "imageId");
    return {
      tag:
        imageId +
        "; purpose=" +
        purposeCode +
        "; permission=" +
        (permissionRecorded ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageId: "I17", purposeCode: "research", permissionRecorded: true },
  output: { tag: "I17; purpose=research; permission=recorded" },
} satisfies ToolExample<Input, Output>;
export const skinImageConsentPurposeTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/skin-image-consent-purpose-tag",
    title: "Skin Image Consent Purpose Tag",
    description:
      "Label explicitly recorded skin-image purpose permission without establishing valid consent or authorizing disclosure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
        permissionRecorded: { type: "boolean" },
      },
      required: ["imageId", "purposeCode", "permissionRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
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
          id: "purposeCode",
          label: "Purpose Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permissionRecorded",
          label: "Permission Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = skinImageConsentPurposeTagTool.execute;
export default skinImageConsentPurposeTagTool;
