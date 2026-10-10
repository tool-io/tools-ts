import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly photoId: string;
  readonly procedureId: string;
  readonly recordedSite: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    photoId: { type: "string", maxLength: 8192, minLength: 1 },
    procedureId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["photoId", "procedureId", "recordedSite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate explicit ENT endoscopy photo and site identifiers without interpreting image findings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { photoId, procedureId, recordedSite } = request;
  const compute = (): Output => {
    H.domain(photoId.length > 0, "photoId");
    H.domain(procedureId.length > 0, "procedureId");
    H.domain(recordedSite.length > 0, "recordedSite");
    return { token: JSON.stringify([photoId, procedureId, recordedSite]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { photoId: "IMG17", procedureId: "ENT3", recordedSite: "site A" },
  output: { token: '["IMG17","ENT3","site A"]' },
} satisfies ToolExample<Input, Output>;
export const entEndoscopySitePhotoTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/ent-endoscopy-site-photo-tag",
    title: "Ent Endoscopy Site Photo Tag",
    description:
      "Associate explicit ENT endoscopy photo and site identifiers without interpreting image findings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        photoId: { type: "string", maxLength: 8192, minLength: 1 },
        procedureId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["photoId", "procedureId", "recordedSite"],
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
          id: "procedureId",
          label: "Procedure Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedSite",
          label: "Recorded Site",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = entEndoscopySitePhotoTagTool.execute;
export default entEndoscopySitePhotoTagTool;
