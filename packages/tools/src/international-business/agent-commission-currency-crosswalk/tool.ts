import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly saleValue: number;
  readonly commissionFraction: number;
  readonly agentCurrencyPerSaleCurrency: number;
  readonly fixedFee: number;
};
export type Output = {
  readonly saleCurrencyCommission: number;
  readonly convertedCommission: number;
  readonly totalAgentPayment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saleValue: { type: "number", minimum: 0 },
    commissionFraction: { type: "number", minimum: 0, maximum: 1 },
    agentCurrencyPerSaleCurrency: { type: "number", exclusiveMinimum: 0 },
    fixedFee: { type: "number", minimum: 0 },
  },
  required: [
    "saleValue",
    "commissionFraction",
    "agentCurrencyPerSaleCurrency",
    "fixedFee",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saleCurrencyCommission: { type: "number" },
    convertedCommission: { type: "number" },
    totalAgentPayment: { type: "number" },
  },
  required: [
    "saleCurrencyCommission",
    "convertedCommission",
    "totalAgentPayment",
  ],
} as const;
/** Calculate agent commission currency crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    saleValue,
    commissionFraction,
    agentCurrencyPerSaleCurrency,
    fixedFee,
  } = request;
  const compute = (): Output => {
    H.domain(saleValue >= 0 && fixedFee >= 0);
    H.probability(commissionFraction);
    H.positive(agentCurrencyPerSaleCurrency);
    return {
      saleCurrencyCommission: saleValue * commissionFraction,
      convertedCommission:
        saleValue * commissionFraction * agentCurrencyPerSaleCurrency,
      totalAgentPayment:
        saleValue * commissionFraction * agentCurrencyPerSaleCurrency +
        fixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    saleValue: 10000,
    commissionFraction: 0.05,
    agentCurrencyPerSaleCurrency: 1.2,
    fixedFee: 100,
  },
  output: {
    saleCurrencyCommission: 500,
    convertedCommission: 600,
    totalAgentPayment: 700,
  },
} satisfies ToolExample<Input, Output>;
export const agentCommissionCurrencyCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/agent-commission-currency-crosswalk",
    title: "Agent Commission Currency Crosswalk Tool",
    description:
      "Calculate agent commission currency crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saleValue: { type: "number", minimum: 0 },
        commissionFraction: { type: "number", minimum: 0, maximum: 1 },
        agentCurrencyPerSaleCurrency: { type: "number", exclusiveMinimum: 0 },
        fixedFee: { type: "number", minimum: 0 },
      },
      required: [
        "saleValue",
        "commissionFraction",
        "agentCurrencyPerSaleCurrency",
        "fixedFee",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saleCurrencyCommission: { type: "number" },
        convertedCommission: { type: "number" },
        totalAgentPayment: { type: "number" },
      },
      required: [
        "saleCurrencyCommission",
        "convertedCommission",
        "totalAgentPayment",
      ],
    },
    ports: {
      inputs: [
        {
          id: "saleValue",
          label: "Sale Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commissionFraction",
          label: "Commission Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "agentCurrencyPerSaleCurrency",
          label: "Agent Currency Per Sale Currency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "saleCurrencyCommission",
          label: "Sale Currency Commission",
          valueType: { type: "number" },
        },
        {
          id: "convertedCommission",
          label: "Converted Commission",
          valueType: { type: "number" },
        },
        {
          id: "totalAgentPayment",
          label: "Total Agent Payment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = agentCommissionCurrencyCrosswalkTool.execute;
export default agentCommissionCurrencyCrosswalkTool;
