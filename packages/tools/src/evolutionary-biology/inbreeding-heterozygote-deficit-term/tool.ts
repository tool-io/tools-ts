import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly p: number; readonly inbreeding: number };
export type Output = {
  readonly heterozygosity: number;
  readonly homozygousFirst: number;
  readonly homozygousSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: { type: "number", minimum: 0, maximum: 1 },
    inbreeding: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["p", "inbreeding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heterozygosity: { type: "number" },
    homozygousFirst: { type: "number" },
    homozygousSecond: { type: "number" },
  },
  required: ["heterozygosity", "homozygousFirst", "homozygousSecond"],
} as const;
/** Nonnegative pedigree inbreeding coefficient genotype proportions; negative population F-statistics are outside this convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { p, inbreeding } = request;
  const compute = (): Output => {
    H.probability(p);
    H.probability(inbreeding);
    return {
      heterozygosity: 2 * p * (1 - p) * (1 - inbreeding),
      homozygousFirst: p * p + inbreeding * p * (1 - p),
      homozygousSecond: (1 - p) ** 2 + inbreeding * p * (1 - p),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { p: 0.5, inbreeding: 0.2 },
  output: { heterozygosity: 0.4, homozygousFirst: 0.3, homozygousSecond: 0.3 },
} satisfies ToolExample<Input, Output>;
export const inbreedingHeterozygoteDeficitTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/inbreeding-heterozygote-deficit-term",
    title: "Inbreeding Heterozygote Deficit Term Tool",
    description:
      "Nonnegative pedigree inbreeding coefficient genotype proportions; negative population F-statistics are outside this convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        p: { type: "number", minimum: 0, maximum: 1 },
        inbreeding: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["p", "inbreeding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heterozygosity: { type: "number" },
        homozygousFirst: { type: "number" },
        homozygousSecond: { type: "number" },
      },
      required: ["heterozygosity", "homozygousFirst", "homozygousSecond"],
    },
    ports: {
      inputs: [
        { id: "p", label: "P", required: true, valueType: { type: "number" } },
        {
          id: "inbreeding",
          label: "Inbreeding",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heterozygosity",
          label: "Heterozygosity",
          valueType: { type: "number" },
        },
        {
          id: "homozygousFirst",
          label: "Homozygous First",
          valueType: { type: "number" },
        },
        {
          id: "homozygousSecond",
          label: "Homozygous Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inbreedingHeterozygoteDeficitTermTool.execute;
export default inbreedingHeterozygoteDeficitTermTool;
