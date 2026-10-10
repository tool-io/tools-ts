import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteId: string;
  readonly photoId: string;
  readonly annotationId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteId: { type: "string", maxLength: 8192, minLength: 1 },
    photoId: { type: "string", maxLength: 8192, minLength: 1 },
    annotationId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["siteId", "photoId", "annotationId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicit periodontal site, photo, and annotation identifiers without image interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteId, photoId, annotationId } = request;
  const compute = (): Output => {
    H.domain(siteId.length > 0, "siteId");
    H.domain(photoId.length > 0, "photoId");
    H.domain(annotationId.length > 0, "annotationId");
    return { token: JSON.stringify([siteId, photoId, annotationId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siteId: "SITE17", photoId: "IMG3", annotationId: "ANN2" },
  output: { token: '["SITE17","IMG3","ANN2"]' },
} satisfies ToolExample<Input, Output>;
export const periodontalSitePhotoReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-site-photo-reference",
    title: "Periodontal Site Photo Reference",
    description:
      "Associate explicit periodontal site, photo, and annotation identifiers without image interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteId: { type: "string", maxLength: 8192, minLength: 1 },
        photoId: { type: "string", maxLength: 8192, minLength: 1 },
        annotationId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["siteId", "photoId", "annotationId"],
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
          id: "siteId",
          label: "Site Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "photoId",
          label: "Photo Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "annotationId",
          label: "Annotation Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = periodontalSitePhotoReferenceTool.execute;
export default periodontalSitePhotoReferenceTool;
