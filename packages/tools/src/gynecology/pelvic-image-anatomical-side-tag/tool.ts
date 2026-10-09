import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly imageId: string; readonly side: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "bilateral", "midline", "unspecified"],
    },
  },
  required: ["imageId", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach explicit anatomical side wording to a pelvic image record without identifying structures from pixels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, side } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(
      ["left", "right", "bilateral", "midline", "unspecified"].includes(side),
      "side",
    );
    return { tag: imageId + " [" + side + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imageId: "IMG17", side: "left" },
  output: { tag: "IMG17 [left]" },
} satisfies ToolExample<Input, Output>;
export const pelvicImageAnatomicalSideTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/pelvic-image-anatomical-side-tag",
    title: "Pelvic Image Anatomical Side Tag",
    description:
      "Attach explicit anatomical side wording to a pelvic image record without identifying structures from pixels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "bilateral", "midline", "unspecified"],
        },
      },
      required: ["imageId", "side"],
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
export const run = pelvicImageAnatomicalSideTagTool.execute;
export default pelvicImageAnatomicalSideTagTool;
