import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly netAmount: number;
  readonly suppliedTaxFraction: number;
};
export type Output = {
  readonly grossAmount: number;
  readonly taxPerGrossFraction: number;
  readonly grossToNetRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netAmount: { type: "number" },
    suppliedTaxFraction: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["netAmount", "suppliedTaxFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossAmount: { type: "number" },
    taxPerGrossFraction: { type: "number" },
    grossToNetRatio: { type: "number" },
  },
  required: ["grossAmount", "taxPerGrossFraction", "grossToNetRatio"],
} as const;
/** Relate an explicit net amount and supplied net-based tax fraction to gross amount and gross-based tax share without selecting tax law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { netAmount, suppliedTaxFraction } = request;
  const compute = (): Output => {
    H.domain(suppliedTaxFraction > -1, "suppliedTaxFraction");
    return {
      grossAmount: netAmount * (1 + suppliedTaxFraction),
      taxPerGrossFraction: suppliedTaxFraction / (1 + suppliedTaxFraction),
      grossToNetRatio: 1 + suppliedTaxFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { netAmount: 100, suppliedTaxFraction: 0.25 },
  output: { grossAmount: 125, taxPerGrossFraction: 0.2, grossToNetRatio: 1.25 },
} satisfies ToolExample<Input, Output>;
export const inclusiveExclusiveTaxRatioPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/inclusive-exclusive-tax-ratio-pair",
    title: "Inclusive Exclusive Tax Ratio Pair",
    description:
      "Relate an explicit net amount and supplied net-based tax fraction to gross amount and gross-based tax share without selecting tax law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netAmount: { type: "number" },
        suppliedTaxFraction: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["netAmount", "suppliedTaxFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossAmount: { type: "number" },
        taxPerGrossFraction: { type: "number" },
        grossToNetRatio: { type: "number" },
      },
      required: ["grossAmount", "taxPerGrossFraction", "grossToNetRatio"],
    },
    ports: {
      inputs: [
        {
          id: "netAmount",
          label: "Net Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxFraction",
          label: "Supplied Tax Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossAmount",
          label: "Gross Amount",
          valueType: { type: "number" },
        },
        {
          id: "taxPerGrossFraction",
          label: "Tax Per Gross Fraction",
          valueType: { type: "number" },
        },
        {
          id: "grossToNetRatio",
          label: "Gross To Net Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inclusiveExclusiveTaxRatioPairTool.execute;
export default inclusiveExclusiveTaxRatioPairTool;
