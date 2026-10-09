import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly containerId: string;
  readonly siteWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    containerId: { type: "string", maxLength: 8192, minLength: 1 },
    siteWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "containerId", "siteWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate supplied gastrointestinal specimen, container, and site identifiers without validating provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, containerId, siteWording } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(containerId.length > 0, "containerId");
    H.domain(siteWording.length > 0, "siteWording");
    return { token: JSON.stringify([specimenId, containerId, siteWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", containerId: "JAR-A", siteWording: "Site A" },
  output: { token: '["S17","JAR-A","Site A"]' },
} satisfies ToolExample<Input, Output>;
export const giSpecimenContainerSiteLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/gi-specimen-container-site-label",
    title: "GI Specimen Container Site Label",
    description:
      "Associate supplied gastrointestinal specimen, container, and site identifiers without validating provenance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        containerId: { type: "string", maxLength: 8192, minLength: 1 },
        siteWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "containerId", "siteWording"],
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
          id: "containerId",
          label: "Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "siteWording",
          label: "Site Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = giSpecimenContainerSiteLabelTool.execute;
export default giSpecimenContainerSiteLabelTool;
