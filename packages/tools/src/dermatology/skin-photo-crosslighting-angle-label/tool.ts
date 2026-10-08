import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly suppliedAngleText: string;
  readonly referenceAxis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAngleText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceAxis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "suppliedAngleText", "referenceAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit skin-photo lighting-angle metadata and its reference axis without estimating image quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, suppliedAngleText, referenceAxis } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(suppliedAngleText.length > 0, "suppliedAngleText");
    H.domain(referenceAxis.length > 0, "referenceAxis");
    return {
      token: JSON.stringify([imageId, suppliedAngleText, referenceAxis]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "I17",
    suppliedAngleText: "45 deg",
    referenceAxis: "camera axis",
  },
  output: { token: '["I17","45 deg","camera axis"]' },
} satisfies ToolExample<Input, Output>;
export const skinPhotoCrosslightingAngleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-photo-crosslighting-angle-label",
    title: "Skin Photo Crosslighting Angle Label Tool",
    description:
      "Preserve explicit skin-photo lighting-angle metadata and its reference axis without estimating image quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAngleText: { type: "string", maxLength: 8192, minLength: 1 },
        referenceAxis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "suppliedAngleText", "referenceAxis"],
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
          id: "suppliedAngleText",
          label: "Supplied Angle Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceAxis",
          label: "Reference Axis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = skinPhotoCrosslightingAngleLabelTool.execute;
export default skinPhotoCrosslightingAngleLabelTool;
