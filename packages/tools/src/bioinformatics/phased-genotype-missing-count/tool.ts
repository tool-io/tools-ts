import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly genotype: string };
export type Output = {
  readonly alleles: number;
  readonly missingAlleles: number;
  readonly fullyPhased: boolean;
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
    alleles: { type: "integer" },
    missingAlleles: { type: "integer" },
    fullyPhased: { type: "boolean" },
  },
  required: ["alleles", "missingAlleles", "fullyPhased"],
} as const;
/** Inspect VCF allele missingness and literal phase separators; no genotype likelihood or biological phasing inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { genotype } = request;
  const compute = (): Output => {
    H.domain(
      /^(?:[0-9]+|\.)(?:[|/](?:[0-9]+|\.))*(?![\s\S])/.test(genotype),
      "genotype",
    );
    const tokens = genotype.split(/[|/]/);
    return {
      alleles: tokens.length,
      missingAlleles: tokens.filter((x) => x === ".").length,
      fullyPhased: tokens.length > 1 && !genotype.includes("/"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { genotype: "0|.|1" },
  output: { alleles: 3, missingAlleles: 1, fullyPhased: true },
} satisfies ToolExample<Input, Output>;
export const phasedGenotypeMissingCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/phased-genotype-missing-count",
    title: "Phased Genotype Missing Count Tool",
    description:
      "Inspect VCF allele missingness and literal phase separators; no genotype likelihood or biological phasing inference.",
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
        alleles: { type: "integer" },
        missingAlleles: { type: "integer" },
        fullyPhased: { type: "boolean" },
      },
      required: ["alleles", "missingAlleles", "fullyPhased"],
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
        { id: "alleles", label: "Alleles", valueType: { type: "integer" } },
        {
          id: "missingAlleles",
          label: "Missing Alleles",
          valueType: { type: "integer" },
        },
        {
          id: "fullyPhased",
          label: "Fully Phased",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = phasedGenotypeMissingCountTool.execute;
export default phasedGenotypeMissingCountTool;
