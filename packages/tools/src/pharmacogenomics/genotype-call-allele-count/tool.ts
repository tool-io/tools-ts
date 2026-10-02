import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alleles: readonly string[];
  readonly missingTokens: readonly string[];
};
export type Output = {
  readonly calledCount: number;
  readonly missingCount: number;
  readonly distinctCalledAlleles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["alleles", "missingTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calledCount: { type: "integer" },
    missingCount: { type: "integer" },
    distinctCalledAlleles: { type: "integer" },
  },
  required: ["calledCount", "missingCount", "distinctCalledAlleles"],
} as const;
/** Count supplied allele-call tokens without calling variants, assigning phase or predicting drug response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alleles, missingTokens } = request;
  const compute = (): Output => {
    const called = alleles.filter((x) => !missingTokens.includes(x));
    return {
      calledCount: called.length,
      missingCount: alleles.length - called.length,
      distinctCalledAlleles: new Set(called).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alleles: ["*1", "*2", "?"], missingTokens: ["?"] },
  output: { calledCount: 2, missingCount: 1, distinctCalledAlleles: 2 },
} satisfies ToolExample<Input, Output>;
export const genotypeCallAlleleCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/genotype-call-allele-count",
    title: "Genotype Call Allele Count Tool",
    description:
      "Count supplied allele-call tokens without calling variants, assigning phase or predicting drug response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["alleles", "missingTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calledCount: { type: "integer" },
        missingCount: { type: "integer" },
        distinctCalledAlleles: { type: "integer" },
      },
      required: ["calledCount", "missingCount", "distinctCalledAlleles"],
    },
    ports: {
      inputs: [
        {
          id: "alleles",
          label: "Alleles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingTokens",
          label: "Missing Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "calledCount",
          label: "Called Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        {
          id: "distinctCalledAlleles",
          label: "Distinct Called Alleles",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = genotypeCallAlleleCountTool.execute;
export default genotypeCallAlleleCountTool;
