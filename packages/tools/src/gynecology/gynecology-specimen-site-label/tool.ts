import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly recordedSite: string;
  readonly siteSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
    siteSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "recordedSite", "siteSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly recorded gynecologic specimen site by its source without anatomical or pathology interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, recordedSite, siteSource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(recordedSite.length > 0, "recordedSite");
    H.domain(siteSource.length > 0, "siteSource");
    return { token: JSON.stringify([specimenId, recordedSite, siteSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "S17",
    recordedSite: "site A",
    siteSource: "Procedure note",
  },
  output: { token: '["S17","site A","Procedure note"]' },
} satisfies ToolExample<Input, Output>;
export const gynecologySpecimenSiteLabelTool = H.defineSchemaCalculation<
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
    id: "gynecology/gynecology-specimen-site-label",
    title: "Gynecology Specimen Site Label",
    description:
      "Qualify an explicitly recorded gynecologic specimen site by its source without anatomical or pathology interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
        siteSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "recordedSite", "siteSource"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedSite",
          label: "Recorded Site",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "siteSource",
          label: "Site Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gynecologySpecimenSiteLabelTool.execute;
export default gynecologySpecimenSiteLabelTool;
