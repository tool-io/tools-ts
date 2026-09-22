import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cleavableBonds: number;
  readonly missedCleavages: number;
  readonly chains: number;
};
export type Output = {
  readonly realizedCleavages: number;
  readonly peptideCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cleavableBonds: { type: "integer", minimum: 0 },
    missedCleavages: { type: "integer", minimum: 0 },
    chains: { type: "integer", minimum: 1 },
  },
  required: ["cleavableBonds", "missedCleavages", "chains"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realizedCleavages: { type: "integer" },
    peptideCount: { type: "integer" },
  },
  required: ["realizedCleavages", "peptideCount"],
} as const;
/** Linear disjoint chains without cyclic peptides or disulfide-linked products; each actual cleavage adds one fragment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cleavableBonds, missedCleavages, chains } = request;
  const compute = (): Output => {
    H.integer(cleavableBonds, 0);
    H.integer(missedCleavages, 0, cleavableBonds);
    H.integer(chains, 1);
    return {
      realizedCleavages: cleavableBonds - missedCleavages,
      peptideCount: chains + cleavableBonds - missedCleavages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cleavableBonds: 10, missedCleavages: 2, chains: 1 },
  output: { realizedCleavages: 8, peptideCount: 9 },
} satisfies ToolExample<Input, Output>;
export const proteinDigestPeptideCountCleavageBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biochemistry/protein-digest-peptide-count-cleavage-budget",
      title: "Protein Digest Peptide Count Cleavage Budget Tool",
      description:
        "Linear disjoint chains without cyclic peptides or disulfide-linked products; each actual cleavage adds one fragment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cleavableBonds: { type: "integer", minimum: 0 },
          missedCleavages: { type: "integer", minimum: 0 },
          chains: { type: "integer", minimum: 1 },
        },
        required: ["cleavableBonds", "missedCleavages", "chains"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          realizedCleavages: { type: "integer" },
          peptideCount: { type: "integer" },
        },
        required: ["realizedCleavages", "peptideCount"],
      },
      ports: {
        inputs: [
          {
            id: "cleavableBonds",
            label: "Cleavable Bonds",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "missedCleavages",
            label: "Missed Cleavages",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "chains",
            label: "Chains",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "realizedCleavages",
            label: "Realized Cleavages",
            valueType: { type: "integer" },
          },
          {
            id: "peptideCount",
            label: "Peptide Count",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = proteinDigestPeptideCountCleavageBudgetTool.execute;
export default proteinDigestPeptideCountCleavageBudgetTool;
