import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerId: string;
  readonly suppliedSite: string;
  readonly specimenId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSite: { type: "string", maxLength: 8192, minLength: 1 },
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["containerId", "suppliedSite", "specimenId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate supplied biopsy container, anatomic site transcription and specimen identifiers without verifying specimen identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerId, suppliedSite, specimenId } = request;
  const compute = (): Output => {
    H.domain(containerId.length > 0, "containerId");
    H.domain(suppliedSite.length > 0, "suppliedSite");
    H.domain(specimenId.length > 0, "specimenId");
    return { token: JSON.stringify([containerId, suppliedSite, specimenId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { containerId: "C17", suppliedSite: "left forearm", specimenId: "S4" },
  output: { token: '["C17","left forearm","S4"]' },
} satisfies ToolExample<Input, Output>;
export const dermatologyBiopsyContainerSitePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/dermatology-biopsy-container-site-pair",
    title: "Dermatology Biopsy Container Site Pair Tool",
    description:
      "Associate supplied biopsy container, anatomic site transcription and specimen identifiers without verifying specimen identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSite: { type: "string", maxLength: 8192, minLength: 1 },
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["containerId", "suppliedSite", "specimenId"],
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
          id: "containerId",
          label: "Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSite",
          label: "Supplied Site",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dermatologyBiopsyContainerSitePairTool.execute;
export default dermatologyBiopsyContainerSitePairTool;
