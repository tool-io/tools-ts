import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceTaxonId: string;
  readonly targetTaxonId: string;
  readonly evidenceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceTaxonId: { type: "string", maxLength: 8192, minLength: 1 },
    targetTaxonId: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceTaxonId", "targetTaxonId", "evidenceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an ordered explicit ecological-network edge and evidence reference without inferring interaction direction or strength. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceTaxonId, targetTaxonId, evidenceId } = request;
  const compute = (): Output => {
    H.domain(sourceTaxonId.length > 0, "sourceTaxonId");
    H.domain(targetTaxonId.length > 0, "targetTaxonId");
    H.domain(evidenceId.length > 0, "evidenceId");
    return {
      token: JSON.stringify([sourceTaxonId, targetTaxonId, evidenceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceTaxonId: "T17", targetTaxonId: "T18", evidenceId: "E4" },
  output: { token: '["T17","T18","E4"]' },
} satisfies ToolExample<Input, Output>;
export const ecologicalNetworkEdgeEvidenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/ecological-network-edge-evidence-token",
    title: "Ecological Network Edge Evidence Token Tool",
    description:
      "Encode an ordered explicit ecological-network edge and evidence reference without inferring interaction direction or strength.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceTaxonId: { type: "string", maxLength: 8192, minLength: 1 },
        targetTaxonId: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceTaxonId", "targetTaxonId", "evidenceId"],
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
          id: "sourceTaxonId",
          label: "Source Taxon Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetTaxonId",
          label: "Target Taxon Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceId",
          label: "Evidence Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ecologicalNetworkEdgeEvidenceTokenTool.execute;
export default ecologicalNetworkEdgeEvidenceTokenTool;
