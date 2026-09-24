import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ebit: number;
  readonly suppliedTaxRate: number;
  readonly interest: number;
  readonly subtractInterest: boolean;
};
export type Output = {
  readonly afterTaxOperating: number;
  readonly interestShield: number;
  readonly conditionalAfterTax: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ebit: { type: "number" },
    suppliedTaxRate: { type: "number", minimum: 0, maximum: 1 },
    interest: { type: "number" },
    subtractInterest: { type: "boolean" },
  },
  required: ["ebit", "suppliedTaxRate", "interest", "subtractInterest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    afterTaxOperating: { type: "number" },
    interestShield: { type: "number" },
    conditionalAfterTax: { type: "number" },
  },
  required: ["afterTaxOperating", "interestShield", "conditionalAfterTax"],
} as const;
/** Illustrate supplied flat-rate operating/interest tax arithmetic without determining deductibility or legal tax treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ebit, suppliedTaxRate, interest, subtractInterest } = request;
  const compute = (): Output => {
    H.probability(suppliedTaxRate);
    return {
      afterTaxOperating: ebit * (1 - suppliedTaxRate),
      interestShield: interest * suppliedTaxRate,
      conditionalAfterTax:
        (ebit - (subtractInterest ? interest : 0)) * (1 - suppliedTaxRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ebit: 100,
    suppliedTaxRate: 0.25,
    interest: 20,
    subtractInterest: false,
  },
  output: { afterTaxOperating: 75, interestShield: 5, conditionalAfterTax: 75 },
} satisfies ToolExample<Input, Output>;
export const unleveredCashflowTaxShieldTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/unlevered-cashflow-tax-shield-term",
    title: "Unlevered Cashflow Tax Shield Term Tool",
    description:
      "Illustrate supplied flat-rate operating/interest tax arithmetic without determining deductibility or legal tax treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ebit: { type: "number" },
        suppliedTaxRate: { type: "number", minimum: 0, maximum: 1 },
        interest: { type: "number" },
        subtractInterest: { type: "boolean" },
      },
      required: ["ebit", "suppliedTaxRate", "interest", "subtractInterest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        afterTaxOperating: { type: "number" },
        interestShield: { type: "number" },
        conditionalAfterTax: { type: "number" },
      },
      required: ["afterTaxOperating", "interestShield", "conditionalAfterTax"],
    },
    ports: {
      inputs: [
        {
          id: "ebit",
          label: "Ebit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxRate",
          label: "Supplied Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interest",
          label: "Interest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subtractInterest",
          label: "Subtract Interest",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "afterTaxOperating",
          label: "After Tax Operating",
          valueType: { type: "number" },
        },
        {
          id: "interestShield",
          label: "Interest Shield",
          valueType: { type: "number" },
        },
        {
          id: "conditionalAfterTax",
          label: "Conditional After Tax",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = unleveredCashflowTaxShieldTermTool.execute;
export default unleveredCashflowTaxShieldTermTool;
