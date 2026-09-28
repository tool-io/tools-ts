import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDay: number;
  readonly conversionDay: number;
  readonly amount: number;
  readonly appliedRate: number;
  readonly referenceRate: number;
};
export type Output = {
  readonly ageDays: number;
  readonly converted: number;
  readonly referenceValueGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDay: { type: "integer" },
    conversionDay: { type: "integer" },
    amount: { type: "number" },
    appliedRate: { type: "number", exclusiveMinimum: 0 },
    referenceRate: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "referenceDay",
    "conversionDay",
    "amount",
    "appliedRate",
    "referenceRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    converted: { type: "number" },
    referenceValueGap: { type: "number" },
  },
  required: ["ageDays", "converted", "referenceValueGap"],
} as const;
/** Quote direction is target currency per source currency; signed date age remains visible without selecting a permissible exchange-date policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDay, conversionDay, amount, appliedRate, referenceRate } =
    request;
  const compute = (): Output => {
    H.positive(appliedRate);
    H.positive(referenceRate);
    return {
      ageDays: conversionDay - referenceDay,
      converted: amount * appliedRate,
      referenceValueGap: amount * (appliedRate - referenceRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceDay: 100,
    conversionDay: 110,
    amount: 1000,
    appliedRate: 1.2,
    referenceRate: 1.1,
  },
  output: {
    ageDays: 10,
    converted: 1200,
    referenceValueGap: 99.99999999999987,
  },
} satisfies ToolExample<Input, Output>;
export const internationalGrantExchangeRateDateGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/international-grant-exchange-rate-date-gap",
      title: "International Grant Exchange Rate Date Gap Tool",
      description:
        "Quote direction is target currency per source currency; signed date age remains visible without selecting a permissible exchange-date policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceDay: { type: "integer" },
          conversionDay: { type: "integer" },
          amount: { type: "number" },
          appliedRate: { type: "number", exclusiveMinimum: 0 },
          referenceRate: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "referenceDay",
          "conversionDay",
          "amount",
          "appliedRate",
          "referenceRate",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ageDays: { type: "integer" },
          converted: { type: "number" },
          referenceValueGap: { type: "number" },
        },
        required: ["ageDays", "converted", "referenceValueGap"],
      },
      ports: {
        inputs: [
          {
            id: "referenceDay",
            label: "Reference Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "conversionDay",
            label: "Conversion Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "amount",
            label: "Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "appliedRate",
            label: "Applied Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRate",
            label: "Reference Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
          {
            id: "converted",
            label: "Converted",
            valueType: { type: "number" },
          },
          {
            id: "referenceValueGap",
            label: "Reference Value Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalGrantExchangeRateDateGapTool.execute;
export default internationalGrantExchangeRateDateGapTool;
