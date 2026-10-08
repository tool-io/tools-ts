import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photoId: string;
  readonly view: string;
  readonly side: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photoId: { type: "string", maxLength: 8192, minLength: 1 },
    view: {
      type: "string",
      maxLength: 8192,
      enum: ["anterior", "posterior", "lateral", "close-up", "other"],
    },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "midline", "unspecified"],
    },
  },
  required: ["photoId", "view", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label explicit skin-photo view and laterality metadata without identifying a person or image content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photoId, view, side } = request;
  const compute = (): Output => {
    H.domain(photoId.length > 0, "photoId");
    H.domain(
      ["anterior", "posterior", "lateral", "close-up", "other"].includes(view),
      "view",
    );
    H.domain(
      ["left", "right", "midline", "unspecified"].includes(side),
      "side",
    );
    return { tag: photoId + " [" + view + "; " + side + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { photoId: "P17", view: "lateral", side: "left" },
  output: { tag: "P17 [lateral; left]" },
} satisfies ToolExample<Input, Output>;
export const skinPhotoViewOrientationTagTool = H.defineSchemaCalculation<
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
    id: "dermatology/skin-photo-view-orientation-tag",
    title: "Skin Photo View Orientation Tag",
    description:
      "Label explicit skin-photo view and laterality metadata without identifying a person or image content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photoId: { type: "string", maxLength: 8192, minLength: 1 },
        view: {
          type: "string",
          maxLength: 8192,
          enum: ["anterior", "posterior", "lateral", "close-up", "other"],
        },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "midline", "unspecified"],
        },
      },
      required: ["photoId", "view", "side"],
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
          id: "photoId",
          label: "Photo Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "view",
          label: "View",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = skinPhotoViewOrientationTagTool.execute;
export default skinPhotoViewOrientationTagTool;
