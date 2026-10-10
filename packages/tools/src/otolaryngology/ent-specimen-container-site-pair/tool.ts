import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly containerId: string;
  readonly recordedSite: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    containerId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "containerId", "recordedSite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit ENT specimen, container, and site identifiers without specimen classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, containerId, recordedSite } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(containerId.length > 0, "containerId");
    H.domain(recordedSite.length > 0, "recordedSite");
    return { token: JSON.stringify([specimenId, containerId, recordedSite]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { specimenId: "S17", containerId: "JAR3", recordedSite: "site A" },
  output: { token: '["S17","JAR3","site A"]' },
} satisfies ToolExample<Input, Output>;
export const entSpecimenContainerSitePairTool = H.defineSchemaCalculation<
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
    id: "otolaryngology/ent-specimen-container-site-pair",
    title: "Ent Specimen Container Site Pair",
    description:
      "Pair explicit ENT specimen, container, and site identifiers without specimen classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        containerId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSite: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "containerId", "recordedSite"],
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
export const run = entSpecimenContainerSitePairTool.execute;
export default entSpecimenContainerSitePairTool;
