import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: string;
  readonly alternates: readonly string[];
  readonly alleleIndex: number;
};
export type Output = { readonly allele: string; readonly kind: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    alternates: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    alleleIndex: { type: "integer", minimum: -1 },
  },
  required: ["reference", "alternates", "alleleIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allele: { type: "string", maxLength: 8192 },
    kind: { type: "string", maxLength: 8192 },
  },
  required: ["allele", "kind"],
} as const;
/** Map a normalized genotype allele index, using -1 for the missing allele sentinel; no biological variant interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, alternates, alleleIndex } = request;
  const compute = (): Output => {
    H.integer(alleleIndex, -1, alternates.length);
    H.domain(reference.length > 0 && alternates.every((x) => x.length > 0));
    return {
      allele:
        alleleIndex < 0
          ? "."
          : alleleIndex === 0
            ? reference
            : alternates[alleleIndex - 1],
      kind:
        alleleIndex < 0
          ? "missing"
          : alleleIndex === 0
            ? "reference"
            : "alternate",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "A", alternates: ["C", "G"], alleleIndex: 2 },
  output: { allele: "G", kind: "alternate" },
} satisfies ToolExample<Input, Output>;
export const vcfAlleleIndexReferenceAlternateTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioinformatics/vcf-allele-index-reference-alternate-token",
      title: "VCF Allele Index Reference Alternate Token Tool",
      description:
        "Map a normalized genotype allele index, using -1 for the missing allele sentinel; no biological variant interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reference: { type: "string", maxLength: 8192 },
          alternates: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          alleleIndex: { type: "integer", minimum: -1 },
        },
        required: ["reference", "alternates", "alleleIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allele: { type: "string", maxLength: 8192 },
          kind: { type: "string", maxLength: 8192 },
        },
        required: ["allele", "kind"],
      },
      ports: {
        inputs: [
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "alternates",
            label: "Alternates",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "alleleIndex",
            label: "Allele Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "allele", label: "Allele", valueType: { type: "string" } },
          { id: "kind", label: "Kind", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = vcfAlleleIndexReferenceAlternateTokenTool.execute;
export default vcfAlleleIndexReferenceAlternateTokenTool;
