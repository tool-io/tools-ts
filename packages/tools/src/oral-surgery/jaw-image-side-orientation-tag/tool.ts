import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly recordedSide: string;
  readonly orientationWording: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSide: { type: "string", maxLength: 8192, minLength: 1 },
    orientationWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "recordedSide", "orientationWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Record supplied jaw-image side and orientation wording without deriving spatial orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, recordedSide, orientationWording } = request;
  const compute = (): Output => {
    H.domain(
      imageId.length > 0 &&
        recordedSide.length > 0 &&
        orientationWording.length > 0,
      "imageId",
    );
    return { tag: JSON.stringify([imageId, recordedSide, orientationWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "IMG17",
    recordedSide: "left",
    orientationWording: "view A",
  },
  output: { tag: '["IMG17","left","view A"]' },
} satisfies ToolExample<Input, Output>;
export const jawImageSideOrientationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/jaw-image-side-orientation-tag",
    title: "Jaw Image Side Orientation Tag",
    description:
      "Record supplied jaw-image side and orientation wording without deriving spatial orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSide: { type: "string", maxLength: 8192, minLength: 1 },
        orientationWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "recordedSide", "orientationWording"],
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
          id: "recordedSide",
          label: "Recorded Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "orientationWording",
          label: "Orientation Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = jawImageSideOrientationTagTool.execute;
export default jawImageSideOrientationTagTool;
