import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashflow: number;
  readonly suppliedDiscountFactor: number;
  readonly totalValue: number;
};
export type Output = {
  readonly presentValue: number;
  readonly contribution: number;
  readonly contributionDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashflow: { type: "number" },
    suppliedDiscountFactor: { type: "number", minimum: 0 },
    totalValue: { type: "number" },
  },
  required: ["cashflow", "suppliedDiscountFactor", "totalValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentValue: { type: "number" },
    contribution: { type: "number" },
    contributionDefined: { type: "boolean" },
  },
  required: ["presentValue", "contribution", "contributionDefined"],
} as const;
/** Compare one signed supplied discounted cash flow to an explicit portfolio value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashflow, suppliedDiscountFactor, totalValue } = request;
  const compute = (): Output => {
    H.domain(suppliedDiscountFactor >= 0);
    return {
      presentValue: cashflow * suppliedDiscountFactor,
      contribution:
        totalValue !== 0 ? (cashflow * suppliedDiscountFactor) / totalValue : 0,
      contributionDefined: totalValue !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashflow: 100, suppliedDiscountFactor: 0.8, totalValue: 200 },
  output: { presentValue: 80, contribution: 0.4, contributionDefined: true },
} satisfies ToolExample<Input, Output>;
export const cashflowValueContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/cashflow-value-contribution",
    title: "Cashflow Value Contribution Tool",
    description:
      "Compare one signed supplied discounted cash flow to an explicit portfolio value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashflow: { type: "number" },
        suppliedDiscountFactor: { type: "number", minimum: 0 },
        totalValue: { type: "number" },
      },
      required: ["cashflow", "suppliedDiscountFactor", "totalValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentValue: { type: "number" },
        contribution: { type: "number" },
        contributionDefined: { type: "boolean" },
      },
      required: ["presentValue", "contribution", "contributionDefined"],
    },
    ports: {
      inputs: [
        {
          id: "cashflow",
          label: "Cashflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDiscountFactor",
          label: "Supplied Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalValue",
          label: "Total Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentValue",
          label: "Present Value",
          valueType: { type: "number" },
        },
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
        {
          id: "contributionDefined",
          label: "Contribution Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cashflowValueContributionTool.execute;
export default cashflowValueContributionTool;
