import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageId: string;
  readonly scaleId: string;
  readonly perspectiveNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageId: { type: "string", maxLength: 8192, minLength: 1 },
    scaleId: { type: "string", maxLength: 8192, minLength: 1 },
    perspectiveNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["imageId", "scaleId", "perspectiveNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit forensic photo scale and perspective metadata without correcting geometry or interpreting evidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imageId, scaleId, perspectiveNote } = request;
  const compute = (): Output => {
    H.domain(imageId.length > 0, "imageId");
    H.domain(scaleId.length > 0, "scaleId");
    H.domain(perspectiveNote.length > 0, "perspectiveNote");
    return { token: JSON.stringify([imageId, scaleId, perspectiveNote]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageId: "I17",
    scaleId: "S4",
    perspectiveNote: "coplanar reference",
  },
  output: { token: '["I17","S4","coplanar reference"]' },
} satisfies ToolExample<Input, Output>;
export const forensicPhotoScalePerspectiveLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/forensic-photo-scale-perspective-label",
    title: "Forensic Photo Scale Perspective Label Tool",
    description:
      "Preserve explicit forensic photo scale and perspective metadata without correcting geometry or interpreting evidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageId: { type: "string", maxLength: 8192, minLength: 1 },
        scaleId: { type: "string", maxLength: 8192, minLength: 1 },
        perspectiveNote: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["imageId", "scaleId", "perspectiveNote"],
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
          id: "scaleId",
          label: "Scale Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "perspectiveNote",
          label: "Perspective Note",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = forensicPhotoScalePerspectiveLabelTool.execute;
export default forensicPhotoScalePerspectiveLabelTool;
