import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly imageId: string; readonly eyeSide: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    eyeSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
  },
  required: ["imageId", "eyeSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach explicit eye laterality to a retinal image record without identifying image orientation or anatomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, eyeSide } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(["left", "right", "unspecified"].includes(eyeSide), "eyeSide");
    return { tag: imageId + " [" + eyeSide + " eye]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageId: "IMG17", eyeSide: "left" },
  output: { tag: "IMG17 [left eye]" },
} satisfies ToolExample<Input, Output>;
export const retinalImageEyeSideTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["ophthalmology", "health and medicine"],
      keywords: ["ophthalmology", "health and medicine"],
    },
    id: "ophthalmology/retinal-image-eye-side-tag",
    title: "Retinal Image Eye Side Tag",
    description:
      "Attach explicit eye laterality to a retinal image record without identifying image orientation or anatomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        eyeSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
      },
      required: ["imageId", "eyeSide"],
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
          id: "eyeSide",
          label: "Eye Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = retinalImageEyeSideTagTool.execute;
export default retinalImageEyeSideTagTool;
