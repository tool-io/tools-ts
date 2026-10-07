import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly namespace: string; readonly taxonId: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192, minLength: 1 },
    taxonId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["namespace", "taxonId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact supplied taxon identifier with its namespace without resolving taxonomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { namespace, taxonId } = request;
  const compute = (): Output => {
    H.domain(namespace.length > 0, "namespace");
    H.domain(taxonId.length > 0, "taxonId");
    return { token: JSON.stringify([namespace, taxonId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { namespace: "N17", taxonId: "00124" },
  output: { token: '["N17","00124"]' },
} satisfies ToolExample<Input, Output>;
export const biodiversityTaxonIdNamespaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/biodiversity-taxon-id-namespace",
    title: "Biodiversity Taxon ID Namespace",
    description:
      "Encode an exact supplied taxon identifier with its namespace without resolving taxonomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192, minLength: 1 },
        taxonId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["namespace", "taxonId"],
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
          id: "namespace",
          label: "Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "taxonId",
          label: "Taxon Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biodiversityTaxonIdNamespaceTool.execute;
export default biodiversityTaxonIdNamespaceTool;
