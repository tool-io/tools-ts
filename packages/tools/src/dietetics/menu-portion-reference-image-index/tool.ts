import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageIds: readonly string[];
  readonly indexOneBased: number;
};
export type Output = { readonly selectedImageId: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    indexOneBased: { type: "integer", minimum: 1 },
  },
  required: ["imageIds", "indexOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { selectedImageId: { type: "string", maxLength: 8192 } },
  required: ["selectedImageId"],
} as const;
/** Select an explicit one-based menu-portion reference image identifier without estimating portion size from an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageIds, indexOneBased } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(indexOneBased) &&
        indexOneBased >= 1 &&
        indexOneBased <= imageIds.length,
      "indexOneBased",
    ),
      indexOneBased);
    return { selectedImageId: imageIds[indexOneBased - 1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageIds: ["IMG4", "IMG5", "IMG6"], indexOneBased: 2 },
  output: { selectedImageId: "IMG5" },
} satisfies ToolExample<Input, Output>;
export const menuPortionReferenceImageIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/menu-portion-reference-image-index",
    title: "Menu Portion Reference Image Index Tool",
    description:
      "Select an explicit one-based menu-portion reference image identifier without estimating portion size from an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        indexOneBased: { type: "integer", minimum: 1 },
      },
      required: ["imageIds", "indexOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { selectedImageId: { type: "string", maxLength: 8192 } },
      required: ["selectedImageId"],
    },
    ports: {
      inputs: [
        {
          id: "imageIds",
          label: "Image Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "indexOneBased",
          label: "Index One Based",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "selectedImageId",
          label: "Selected Image Id",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = menuPortionReferenceImageIndexTool.execute;
export default menuPortionReferenceImageIndexTool;
