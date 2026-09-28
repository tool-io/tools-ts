import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localCost: number;
  readonly localPriceIndex: number;
  readonly basePriceIndex: number;
  readonly targetCurrencyPerLocal: number;
  readonly overheadFraction: number;
};
export type Output = {
  readonly baseLocalCost: number;
  readonly convertedCost: number;
  readonly includingOverhead: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localCost: { type: "number" },
    localPriceIndex: { type: "number", exclusiveMinimum: 0 },
    basePriceIndex: { type: "number", exclusiveMinimum: 0 },
    targetCurrencyPerLocal: { type: "number", exclusiveMinimum: 0 },
    overheadFraction: { type: "number", minimum: 0 },
  },
  required: [
    "localCost",
    "localPriceIndex",
    "basePriceIndex",
    "targetCurrencyPerLocal",
    "overheadFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseLocalCost: { type: "number" },
    convertedCost: { type: "number" },
    includingOverhead: { type: "number" },
  },
  required: ["baseLocalCost", "convertedCost", "includingOverhead"],
} as const;
/** Calculate transnational project local cost price factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    localCost,
    localPriceIndex,
    basePriceIndex,
    targetCurrencyPerLocal,
    overheadFraction,
  } = request;
  const compute = (): Output => {
    H.positive(localPriceIndex);
    H.positive(basePriceIndex);
    H.positive(targetCurrencyPerLocal);
    H.domain(overheadFraction >= 0);
    return {
      baseLocalCost: (localCost * basePriceIndex) / localPriceIndex,
      convertedCost:
        (localCost * basePriceIndex * targetCurrencyPerLocal) / localPriceIndex,
      includingOverhead:
        (localCost *
          basePriceIndex *
          targetCurrencyPerLocal *
          (1 + overheadFraction)) /
        localPriceIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    localCost: 1200,
    localPriceIndex: 120,
    basePriceIndex: 100,
    targetCurrencyPerLocal: 2,
    overheadFraction: 0.1,
  },
  output: { baseLocalCost: 1000, convertedCost: 2000, includingOverhead: 2200 },
} satisfies ToolExample<Input, Output>;
export const transnationalProjectLocalCostPriceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/transnational-project-local-cost-price-factor",
      title: "Transnational Project Local Cost Price Factor Tool",
      description:
        "Calculate transnational project local cost price factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          localCost: { type: "number" },
          localPriceIndex: { type: "number", exclusiveMinimum: 0 },
          basePriceIndex: { type: "number", exclusiveMinimum: 0 },
          targetCurrencyPerLocal: { type: "number", exclusiveMinimum: 0 },
          overheadFraction: { type: "number", minimum: 0 },
        },
        required: [
          "localCost",
          "localPriceIndex",
          "basePriceIndex",
          "targetCurrencyPerLocal",
          "overheadFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseLocalCost: { type: "number" },
          convertedCost: { type: "number" },
          includingOverhead: { type: "number" },
        },
        required: ["baseLocalCost", "convertedCost", "includingOverhead"],
      },
      ports: {
        inputs: [
          {
            id: "localCost",
            label: "Local Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "localPriceIndex",
            label: "Local Price Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "basePriceIndex",
            label: "Base Price Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetCurrencyPerLocal",
            label: "Target Currency Per Local",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overheadFraction",
            label: "Overhead Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "baseLocalCost",
            label: "Base Local Cost",
            valueType: { type: "number" },
          },
          {
            id: "convertedCost",
            label: "Converted Cost",
            valueType: { type: "number" },
          },
          {
            id: "includingOverhead",
            label: "Including Overhead",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = transnationalProjectLocalCostPriceFactorTool.execute;
export default transnationalProjectLocalCostPriceFactorTool;
