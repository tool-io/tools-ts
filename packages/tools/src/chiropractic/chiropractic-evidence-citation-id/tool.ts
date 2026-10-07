import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimId: string;
  readonly citationId: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimId: { type: "string", maxLength: 8192, minLength: 1 },
    citationId: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["claimId", "citationId", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link a recorded claim to an explicit citation identifier without retrieving or evaluating the evidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimId, citationId, edition } = request;
  const compute = (): Output => {
    H.domain(claimId.length > 0, "claimId");
    H.domain(citationId.length > 0, "citationId");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([claimId, citationId, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimId: "CL17", citationId: "doi:10.1234/local", edition: "v2" },
  output: { token: '["CL17","doi:10.1234/local","v2"]' },
} satisfies ToolExample<Input, Output>;
export const chiropracticEvidenceCitationIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/chiropractic-evidence-citation-id",
    title: "Chiropractic Evidence Citation ID",
    description:
      "Link a recorded claim to an explicit citation identifier without retrieving or evaluating the evidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimId: { type: "string", maxLength: 8192, minLength: 1 },
        citationId: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["claimId", "citationId", "edition"],
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
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chiropracticEvidenceCitationIdTool.execute;
export default chiropracticEvidenceCitationIdTool;
