import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photoId: string;
  readonly scaleReference: string;
  readonly perspectiveNote: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photoId: { type: "string", maxLength: 8192, minLength: 1 },
    scaleReference: { type: "string", maxLength: 8192, minLength: 1 },
    perspectiveNote: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["photoId", "scaleReference", "perspectiveNote"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit zoology photo scale and perspective metadata without estimating specimen dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photoId, scaleReference, perspectiveNote } = request;
  const compute = (): Output => {
    H.domain(photoId.length > 0, "photoId");
    H.domain(scaleReference.length > 0, "scaleReference");
    H.domain(perspectiveNote.length > 0, "perspectiveNote");
    return {
      token: JSON.stringify([photoId, scaleReference, perspectiveNote]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    photoId: "P17",
    scaleReference: "scale S4",
    perspectiveNote: "same plane",
  },
  output: { token: '["P17","scale S4","same plane"]' },
} satisfies ToolExample<Input, Output>;
export const zoologyPhotoScalePerspectiveTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/zoology-photo-scale-perspective-token",
    title: "Zoology Photo Scale Perspective Token Tool",
    description:
      "Record explicit zoology photo scale and perspective metadata without estimating specimen dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photoId: { type: "string", maxLength: 8192, minLength: 1 },
        scaleReference: { type: "string", maxLength: 8192, minLength: 1 },
        perspectiveNote: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["photoId", "scaleReference", "perspectiveNote"],
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
          id: "photoId",
          label: "Photo Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scaleReference",
          label: "Scale Reference",
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
export const run = zoologyPhotoScalePerspectiveTokenTool.execute;
export default zoologyPhotoScalePerspectiveTokenTool;
