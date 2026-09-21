import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxInclusivePrice: number;
  readonly taxRate: number;
  readonly rebateFraction: number;
};
export type Output = {
  readonly pretaxPrice: number;
  readonly includedTax: number;
  readonly rebate: number;
  readonly netCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxInclusivePrice: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    rebateFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["taxInclusivePrice", "taxRate", "rebateFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pretaxPrice: { type: "number" },
    includedTax: { type: "number" },
    rebate: { type: "number" },
    netCost: { type: "number" },
  },
  required: ["pretaxPrice", "includedTax", "rebate", "netCost"],
} as const;
/** Calculate agricultural input tax rebate term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxInclusivePrice, taxRate, rebateFraction } = request;
  const compute = (): Output => {
    H.domain(taxInclusivePrice >= 0 && taxRate >= 0);
    H.probability(rebateFraction);
    return {
      pretaxPrice: taxInclusivePrice / (1 + taxRate),
      includedTax: taxInclusivePrice - taxInclusivePrice / (1 + taxRate),
      rebate:
        (taxInclusivePrice - taxInclusivePrice / (1 + taxRate)) *
        rebateFraction,
      netCost:
        taxInclusivePrice -
        (taxInclusivePrice - taxInclusivePrice / (1 + taxRate)) *
          rebateFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taxInclusivePrice: 120, taxRate: 0.2, rebateFraction: 0.5 },
  output: { pretaxPrice: 100, includedTax: 20, rebate: 10, netCost: 110 },
} satisfies ToolExample<Input, Output>;
export const agriculturalInputTaxRebateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/agricultural-input-tax-rebate-term",
    title: "Agricultural Input Tax Rebate Term Tool",
    description:
      "Calculate agricultural input tax rebate term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxInclusivePrice: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        rebateFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["taxInclusivePrice", "taxRate", "rebateFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pretaxPrice: { type: "number" },
        includedTax: { type: "number" },
        rebate: { type: "number" },
        netCost: { type: "number" },
      },
      required: ["pretaxPrice", "includedTax", "rebate", "netCost"],
    },
    ports: {
      inputs: [
        {
          id: "taxInclusivePrice",
          label: "Tax Inclusive Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rebateFraction",
          label: "Rebate Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pretaxPrice",
          label: "Pretax Price",
          valueType: { type: "number" },
        },
        {
          id: "includedTax",
          label: "Included Tax",
          valueType: { type: "number" },
        },
        { id: "rebate", label: "Rebate", valueType: { type: "number" } },
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = agriculturalInputTaxRebateTermTool.execute;
export default agriculturalInputTaxRebateTermTool;
