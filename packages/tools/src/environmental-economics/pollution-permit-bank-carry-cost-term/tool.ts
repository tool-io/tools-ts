import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permits: number;
  readonly currentPrice: number;
  readonly futurePrice: number;
  readonly annualRate: number;
  readonly years: number;
  readonly storageCost: number;
};
export type Output = {
  readonly presentFutureValue: number;
  readonly netCarryValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permits: { type: "number", minimum: 0 },
    currentPrice: { type: "number" },
    futurePrice: { type: "number" },
    annualRate: { type: "number", exclusiveMinimum: -1 },
    years: { type: "number", minimum: 0 },
    storageCost: { type: "number", minimum: 0 },
  },
  required: [
    "permits",
    "currentPrice",
    "futurePrice",
    "annualRate",
    "years",
    "storageCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentFutureValue: { type: "number" },
    netCarryValue: { type: "number" },
  },
  required: ["presentFutureValue", "netCarryValue"],
} as const;
/** Calculate pollution permit bank carry cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permits, currentPrice, futurePrice, annualRate, years, storageCost } =
    request;
  const compute = (): Output => {
    H.domain(permits >= 0 && annualRate > -1 && years >= 0 && storageCost >= 0);
    return {
      presentFutureValue: (permits * futurePrice) / (1 + annualRate) ** years,
      netCarryValue:
        (permits * futurePrice) / (1 + annualRate) ** years -
        permits * currentPrice -
        storageCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    permits: 100,
    currentPrice: 10,
    futurePrice: 12,
    annualRate: 0.1,
    years: 1,
    storageCost: 20,
  },
  output: {
    presentFutureValue: 1090.9090909090908,
    netCarryValue: 70.90909090909076,
  },
} satisfies ToolExample<Input, Output>;
export const pollutionPermitBankCarryCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/pollution-permit-bank-carry-cost-term",
    title: "Pollution Permit Bank Carry Cost Term Tool",
    description:
      "Calculate pollution permit bank carry cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permits: { type: "number", minimum: 0 },
        currentPrice: { type: "number" },
        futurePrice: { type: "number" },
        annualRate: { type: "number", exclusiveMinimum: -1 },
        years: { type: "number", minimum: 0 },
        storageCost: { type: "number", minimum: 0 },
      },
      required: [
        "permits",
        "currentPrice",
        "futurePrice",
        "annualRate",
        "years",
        "storageCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentFutureValue: { type: "number" },
        netCarryValue: { type: "number" },
      },
      required: ["presentFutureValue", "netCarryValue"],
    },
    ports: {
      inputs: [
        {
          id: "permits",
          label: "Permits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentPrice",
          label: "Current Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "futurePrice",
          label: "Future Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storageCost",
          label: "Storage Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentFutureValue",
          label: "Present Future Value",
          valueType: { type: "number" },
        },
        {
          id: "netCarryValue",
          label: "Net Carry Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pollutionPermitBankCarryCostTermTool.execute;
export default pollutionPermitBankCarryCostTermTool;
