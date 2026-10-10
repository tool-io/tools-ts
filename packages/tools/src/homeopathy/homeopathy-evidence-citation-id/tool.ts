import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly citationId: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    citationId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["claimId", "citationId", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a supplied evidence citation by recorded claim and version without evaluating efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, citationId, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0, "claimId");
    H.domain(citationId.length > 0, "citationId");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return { token: JSON.stringify([claimId, citationId, sourceVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "CL17", citationId: "REPORT8", sourceVersion: "v2" },
  output: { token: '["CL17","REPORT8","v2"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathyEvidenceCitationIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-evidence-citation-id",
    title: "Homeopathy Evidence Citation ID",
    description:
      "Qualify a supplied evidence citation by recorded claim and version without evaluating efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192, minLength: 1 },
        citationId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["claimId", "citationId", "sourceVersion"],
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
          id: "claimId",
          label: "Claim Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "citationId",
          label: "Citation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeopathyEvidenceCitationIdTool.execute;
export default homeopathyEvidenceCitationIdTool;
