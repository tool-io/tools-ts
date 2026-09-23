import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly genotype: string };
export type Output = {
  readonly ploidy: number;
  readonly allMissing: boolean;
  readonly partiallyMissing: boolean;
  readonly phased: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { genotype: { type: "string", maxLength: 8192 } },
  required: ["genotype"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ploidy: { type: "integer" },
    allMissing: { type: "boolean" },
    partiallyMissing: { type: "boolean" },
    phased: { type: "boolean" },
  },
  required: ["ploidy", "allMissing", "partiallyMissing", "phased"],
} as const;
/** Count genotype allele slots including missing tokens; phased=true requires only pipe separators and at least two alleles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { genotype } = request;
  const compute = (): Output => {
    H.domain(/^(?:\.|[0-9]+)(?:[\/|](?:\.|[0-9]+))*(?![\s\S])/.test(genotype));
    const alleles = genotype.split(/[\/|]/);
    H.domain(alleles.length <= 256);
    const missing = alleles.filter((x) => x === ".").length;
    return {
      ploidy: alleles.length,
      allMissing: missing === alleles.length,
      partiallyMissing: missing > 0 && missing < alleles.length,
      phased:
        alleles.length > 1 && genotype.includes("|") && !genotype.includes("/"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { genotype: "./." },
  output: {
    ploidy: 2,
    allMissing: true,
    partiallyMissing: false,
    phased: false,
  },
} satisfies ToolExample<Input, Output>;
export const vcfMissingGenotypePloidyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/vcf-missing-genotype-ploidy-token",
    title: "VCF Missing Genotype Ploidy Token Tool",
    description:
      "Count genotype allele slots including missing tokens; phased=true requires only pipe separators and at least two alleles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { genotype: { type: "string", maxLength: 8192 } },
      required: ["genotype"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ploidy: { type: "integer" },
        allMissing: { type: "boolean" },
        partiallyMissing: { type: "boolean" },
        phased: { type: "boolean" },
      },
      required: ["ploidy", "allMissing", "partiallyMissing", "phased"],
    },
    ports: {
      inputs: [
        {
          id: "genotype",
          label: "Genotype",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ploidy", label: "Ploidy", valueType: { type: "integer" } },
        {
          id: "allMissing",
          label: "All Missing",
          valueType: { type: "boolean" },
        },
        {
          id: "partiallyMissing",
          label: "Partially Missing",
          valueType: { type: "boolean" },
        },
        { id: "phased", label: "Phased", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vcfMissingGenotypePloidyTokenTool.execute;
export default vcfMissingGenotypePloidyTokenTool;
