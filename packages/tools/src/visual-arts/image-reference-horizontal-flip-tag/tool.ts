import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly horizontalFlipRecorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    horizontalFlipRecorded: { type: "boolean" },
  },
  required: ["recordId", "horizontalFlipRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit reference-image flip flag without modifying image pixels or inferring original orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, horizontalFlipRecorded } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    return {
      label:
        recordId +
        (horizontalFlipRecorded
          ? " [horizontally flipped]"
          : " [orientation unchanged]"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "IMG17", horizontalFlipRecorded: true },
  output: { label: "IMG17 [horizontally flipped]" },
} satisfies ToolExample<Input, Output>;
export const imageReferenceHorizontalFlipTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["visual-arts", "visual arts", "arts and design"],
      keywords: ["visual arts", "arts and design"],
    },
    id: "visual-arts/image-reference-horizontal-flip-tag",
    title: "Image Reference Horizontal Flip Tag",
    description:
      "Label an explicit reference-image flip flag without modifying image pixels or inferring original orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        horizontalFlipRecorded: { type: "boolean" },
      },
      required: ["recordId", "horizontalFlipRecorded"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "horizontalFlipRecorded",
          label: "Horizontal Flip Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = imageReferenceHorizontalFlipTagTool.execute;
export default imageReferenceHorizontalFlipTagTool;
