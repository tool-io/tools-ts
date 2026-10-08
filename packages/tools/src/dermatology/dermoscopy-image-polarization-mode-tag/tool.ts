import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly imageId: string; readonly mode: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["polarized", "nonpolarized", "unknown"],
    },
  },
  required: ["imageId", "mode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied dermoscopy acquisition polarization mode without interpreting an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, mode } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(["polarized", "nonpolarized", "unknown"].includes(mode), "mode");
    return { label: imageId + " [" + mode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageId: "I17", mode: "polarized" },
  output: { label: "I17 [polarized]" },
} satisfies ToolExample<Input, Output>;
export const dermoscopyImagePolarizationModeTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/dermoscopy-image-polarization-mode-tag",
    title: "Dermoscopy Image Polarization Mode Tag Tool",
    description:
      "Label an explicitly supplied dermoscopy acquisition polarization mode without interpreting an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        mode: {
          type: "string",
          maxLength: 8192,
          enum: ["polarized", "nonpolarized", "unknown"],
        },
      },
      required: ["imageId", "mode"],
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
          id: "imageId",
          label: "Image Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dermoscopyImagePolarizationModeTagTool.execute;
export default dermoscopyImagePolarizationModeTagTool;
