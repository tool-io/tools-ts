import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly geneLabel: string;
  readonly referenceId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geneLabel: { type: "string", maxLength: 8192, minLength: 1 },
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["geneLabel", "referenceId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit pharmacogene reference by version without validating an allele or gene annotation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { geneLabel, referenceId, version } = request;
  const compute = (): Output => {
    H.domain(geneLabel.length > 0, "geneLabel");
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([geneLabel, referenceId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { geneLabel: "GENE-A", referenceId: "REF17", version: "v2" },
  output: { token: '["GENE-A","REF17","v2"]' },
} satisfies ToolExample<Input, Output>;
export const pharmacogeneReferenceVersionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacogenomics", "pharmacy"],
      keywords: ["pharmacogenomics", "pharmacy"],
    },
    id: "pharmacogenomics/pharmacogene-reference-version-token",
    title: "Pharmacogene Reference Version Token",
    description:
      "Qualify an explicit pharmacogene reference by version without validating an allele or gene annotation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geneLabel: { type: "string", maxLength: 8192, minLength: 1 },
        referenceId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["geneLabel", "referenceId", "version"],
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
          id: "geneLabel",
          label: "Gene Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceId",
          label: "Reference Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pharmacogeneReferenceVersionTokenTool.execute;
export default pharmacogeneReferenceVersionTokenTool;
