import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly salePrice: number;
  readonly mortgagePayoff: number;
  readonly costs: number;
  readonly adjustment: number;
};
export type Output = { readonly netProceeds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salePrice: { type: "number", minimum: 0 },
    mortgagePayoff: { type: "number", minimum: 0 },
    costs: { type: "number", minimum: 0 },
    adjustment: { type: "number" },
  },
  required: ["salePrice", "mortgagePayoff", "costs", "adjustment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netProceeds: { type: "number" } },
  required: ["netProceeds"],
} as const;
/** Signed closing adjustment is added to sale proceeds after supplied payoff and costs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { salePrice, mortgagePayoff, costs, adjustment } = request;
  const compute = (): Output => {
    H.domain(salePrice >= 0 && mortgagePayoff >= 0 && costs >= 0);
    return { netProceeds: salePrice - mortgagePayoff - costs + adjustment };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    salePrice: 200000,
    mortgagePayoff: 100000,
    costs: 10000,
    adjustment: -2000,
  },
  output: { netProceeds: 88000 },
} satisfies ToolExample<Input, Output>;
export const saleNetProceedsOneAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/sale-net-proceeds-one-adjustment",
    title: "Sale Net Proceeds One Adjustment Tool",
    description:
      "Signed closing adjustment is added to sale proceeds after supplied payoff and costs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        salePrice: { type: "number", minimum: 0 },
        mortgagePayoff: { type: "number", minimum: 0 },
        costs: { type: "number", minimum: 0 },
        adjustment: { type: "number" },
      },
      required: ["salePrice", "mortgagePayoff", "costs", "adjustment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netProceeds: { type: "number" } },
      required: ["netProceeds"],
    },
    ports: {
      inputs: [
        {
          id: "salePrice",
          label: "Sale Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "mortgagePayoff",
          label: "Mortgage Payoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "adjustment",
          label: "Adjustment",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netProceeds",
          label: "Net Proceeds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = saleNetProceedsOneAdjustmentTool.execute;
export default saleNetProceedsOneAdjustmentTool;
