import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly alternate: string };
export type Output = {
  readonly commonPrefix: number;
  readonly commonSuffixAfterPrefix: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    alternate: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "alternate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonPrefix: { type: "integer" },
    commonSuffixAfterPrefix: { type: "integer" },
  },
  required: ["commonPrefix", "commonSuffixAfterPrefix"],
} as const;
/** Count literal common sequence-allele flanks without trimming, normalization or claims that every common base is mandatory VCF padding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, alternate } = request;
  const compute = (): Output => {
    H.domain(
      /^[ACGTNacgtn]+(?![\s\S])/.test(reference) &&
        /^[ACGTNacgtn]+(?![\s\S])/.test(alternate),
    );
    let commonPrefix = 0;
    while (
      commonPrefix < Math.min(reference.length, alternate.length) &&
      reference[commonPrefix] === alternate[commonPrefix]
    )
      commonPrefix++;
    let commonSuffixAfterPrefix = 0;
    while (
      commonSuffixAfterPrefix <
        Math.min(reference.length, alternate.length) - commonPrefix &&
      reference[reference.length - 1 - commonSuffixAfterPrefix] ===
        alternate[alternate.length - 1 - commonSuffixAfterPrefix]
    )
      commonSuffixAfterPrefix++;
    return { commonPrefix, commonSuffixAfterPrefix };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "AT", alternate: "A" },
  output: { commonPrefix: 1, commonSuffixAfterPrefix: 0 },
} satisfies ToolExample<Input, Output>;
export const vcfReferencePaddingCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/vcf-reference-padding-count",
    title: "VCF Reference Padding Count Tool",
    description:
      "Count literal common sequence-allele flanks without trimming, normalization or claims that every common base is mandatory VCF padding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        alternate: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "alternate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonPrefix: { type: "integer" },
        commonSuffixAfterPrefix: { type: "integer" },
      },
      required: ["commonPrefix", "commonSuffixAfterPrefix"],
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
          id: "alternate",
          label: "Alternate",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "commonPrefix",
          label: "Common Prefix",
          valueType: { type: "integer" },
        },
        {
          id: "commonSuffixAfterPrefix",
          label: "Common Suffix After Prefix",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = vcfReferencePaddingCountTool.execute;
export default vcfReferencePaddingCountTool;
