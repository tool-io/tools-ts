import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interest: number;
  readonly suppliedTaxFraction: number;
  readonly discountFactor: number;
};
export type Output = { readonly presentValueTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interest: { type: "number", minimum: 0 },
    suppliedTaxFraction: { type: "number", minimum: 0, maximum: 1 },
    discountFactor: { type: "number", minimum: 0 },
  },
  required: ["interest", "suppliedTaxFraction", "discountFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presentValueTerm: { type: "number" } },
  required: ["presentValueTerm"],
} as const;
/** Discount one supplied interest-tax shield assuming full usability, without tax-law or valuation advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interest, suppliedTaxFraction, discountFactor } = request;
  const compute = (): Output => {
    H.domain(interest >= 0 && discountFactor >= 0);
    H.probability(suppliedTaxFraction);
    return {
      presentValueTerm: interest * suppliedTaxFraction * discountFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interest: 100, suppliedTaxFraction: 0.25, discountFactor: 0.8 },
  output: { presentValueTerm: 20 },
} satisfies ToolExample<Input, Output>;
export const taxShieldDiscountWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/tax-shield-discount-weight",
    title: "Tax Shield Discount Weight Tool",
    description:
      "Discount one supplied interest-tax shield assuming full usability, without tax-law or valuation advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interest: { type: "number", minimum: 0 },
        suppliedTaxFraction: { type: "number", minimum: 0, maximum: 1 },
        discountFactor: { type: "number", minimum: 0 },
      },
      required: ["interest", "suppliedTaxFraction", "discountFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { presentValueTerm: { type: "number" } },
      required: ["presentValueTerm"],
    },
    ports: {
      inputs: [
        {
          id: "interest",
          label: "Interest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxFraction",
          label: "Supplied Tax Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentValueTerm",
          label: "Present Value Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxShieldDiscountWeightTool.execute;
export default taxShieldDiscountWeightTool;
