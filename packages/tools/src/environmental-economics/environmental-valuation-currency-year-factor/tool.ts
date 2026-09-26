import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceValue: number;
  readonly sourcePriceIndex: number;
  readonly targetPriceIndex: number;
  readonly targetCurrencyPerSource: number;
};
export type Output = {
  readonly inflationFactor: number;
  readonly targetValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceValue: { type: "number" },
    sourcePriceIndex: { type: "number", exclusiveMinimum: 0 },
    targetPriceIndex: { type: "number", exclusiveMinimum: 0 },
    targetCurrencyPerSource: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sourceValue",
    "sourcePriceIndex",
    "targetPriceIndex",
    "targetCurrencyPerSource",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inflationFactor: { type: "number" },
    targetValue: { type: "number" },
  },
  required: ["inflationFactor", "targetValue"],
} as const;
/** Revalue with caller-supplied price indices and an explicitly directed exchange factor; no exchange rate lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceValue,
    sourcePriceIndex,
    targetPriceIndex,
    targetCurrencyPerSource,
  } = request;
  const compute = (): Output => {
    H.positive(sourcePriceIndex);
    H.positive(targetPriceIndex);
    H.positive(targetCurrencyPerSource);
    return {
      inflationFactor: targetPriceIndex / sourcePriceIndex,
      targetValue:
        ((sourceValue * targetPriceIndex) / sourcePriceIndex) *
        targetCurrencyPerSource,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceValue: 100,
    sourcePriceIndex: 100,
    targetPriceIndex: 125,
    targetCurrencyPerSource: 0.8,
  },
  output: { inflationFactor: 1.25, targetValue: 100 },
} satisfies ToolExample<Input, Output>;
export const environmentalValuationCurrencyYearFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/environmental-valuation-currency-year-factor",
      title: "Environmental Valuation Currency Year Factor Tool",
      description:
        "Revalue with caller-supplied price indices and an explicitly directed exchange factor; no exchange rate lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceValue: { type: "number" },
          sourcePriceIndex: { type: "number", exclusiveMinimum: 0 },
          targetPriceIndex: { type: "number", exclusiveMinimum: 0 },
          targetCurrencyPerSource: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "sourceValue",
          "sourcePriceIndex",
          "targetPriceIndex",
          "targetCurrencyPerSource",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inflationFactor: { type: "number" },
          targetValue: { type: "number" },
        },
        required: ["inflationFactor", "targetValue"],
      },
      ports: {
        inputs: [
          {
            id: "sourceValue",
            label: "Source Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourcePriceIndex",
            label: "Source Price Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetPriceIndex",
            label: "Target Price Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetCurrencyPerSource",
            label: "Target Currency Per Source",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "inflationFactor",
            label: "Inflation Factor",
            valueType: { type: "number" },
          },
          {
            id: "targetValue",
            label: "Target Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = environmentalValuationCurrencyYearFactorTool.execute;
export default environmentalValuationCurrencyYearFactorTool;
