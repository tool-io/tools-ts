import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly genotypeToken: string };
export type Output = {
  readonly alleleTokens: readonly string[];
  readonly separators: readonly string[];
  readonly hasPhasedSeparator: boolean;
  readonly hasUnphasedSeparator: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { genotypeToken: { type: "string", maxLength: 8192 } },
  required: ["genotypeToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleleTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    separators: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    hasPhasedSeparator: { type: "boolean" },
    hasUnphasedSeparator: { type: "boolean" },
  },
  required: [
    "alleleTokens",
    "separators",
    "hasPhasedSeparator",
    "hasUnphasedSeparator",
  ],
} as const;
/** Inspect explicit separators in a VCF 4.5 GT token, including an optional first phase indicator, preserving missing alleles without validating allele indices or inferring omitted indicators. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { genotypeToken } = request;
  const compute = (): Output => {
    H.domain(
      /^[|/]?(?:[0-9]+|[.])(?:[|/](?:[0-9]+|[.]))*(?![\s\S])/.test(
        genotypeToken,
      ),
      "genotypeToken",
    );
    const separators = Array.from(genotypeToken).filter(
      (value) => value === "|" || value === "/",
    );
    const allelePart = /^[|/]/.test(genotypeToken)
      ? genotypeToken.slice(1)
      : genotypeToken;
    return {
      alleleTokens: allelePart.split(/[|/]/),
      separators,
      hasPhasedSeparator: separators.includes("|"),
      hasUnphasedSeparator: separators.includes("/"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { genotypeToken: "0|1" },
  output: {
    alleleTokens: ["0", "1"],
    separators: ["|"],
    hasPhasedSeparator: true,
    hasUnphasedSeparator: false,
  },
} satisfies ToolExample<Input, Output>;
export const vcfGenotypeAlleleSeparatorFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/vcf-genotype-allele-separator-flag",
    title: "VCF Genotype Allele Separator Flag",
    description:
      "Inspect explicit separators in a VCF 4.5 GT token, including an optional first phase indicator, preserving missing alleles without validating allele indices or inferring omitted indicators.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { genotypeToken: { type: "string", maxLength: 8192 } },
      required: ["genotypeToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleleTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        separators: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        hasPhasedSeparator: { type: "boolean" },
        hasUnphasedSeparator: { type: "boolean" },
      },
      required: [
        "alleleTokens",
        "separators",
        "hasPhasedSeparator",
        "hasUnphasedSeparator",
      ],
    },
    ports: {
      inputs: [
        {
          id: "genotypeToken",
          label: "Genotype Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "alleleTokens",
          label: "Allele Tokens",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "separators",
          label: "Separators",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "hasPhasedSeparator",
          label: "Has Phased Separator",
          valueType: { type: "boolean" },
        },
        {
          id: "hasUnphasedSeparator",
          label: "Has Unphased Separator",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = vcfGenotypeAlleleSeparatorFlagTool.execute;
export default vcfGenotypeAlleleSeparatorFlagTool;
