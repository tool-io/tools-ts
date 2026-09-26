import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalAmount: number;
  readonly sourcePriceIndex: number;
  readonly targetPriceIndex: number;
  readonly suppliedComparison: number;
};
export type Output = {
  readonly rebasedAmount: number;
  readonly comparisonGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalAmount: { type: "number" },
    sourcePriceIndex: { type: "number", exclusiveMinimum: 0 },
    targetPriceIndex: { type: "number", exclusiveMinimum: 0 },
    suppliedComparison: { type: "number" },
  },
  required: [
    "nominalAmount",
    "sourcePriceIndex",
    "targetPriceIndex",
    "suppliedComparison",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rebasedAmount: { type: "number" },
    comparisonGap: { type: "number" },
  },
  required: ["rebasedAmount", "comparisonGap"],
} as const;
/** Rebase a signed historical monetary quantity with explicit price indices, not an exchange-rate lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    nominalAmount,
    sourcePriceIndex,
    targetPriceIndex,
    suppliedComparison,
  } = request;
  const compute = (): Output => {
    H.positive(sourcePriceIndex);
    H.positive(targetPriceIndex);
    return {
      rebasedAmount: nominalAmount * (targetPriceIndex / sourcePriceIndex),
      comparisonGap:
        nominalAmount * (targetPriceIndex / sourcePriceIndex) -
        suppliedComparison,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalAmount: 100,
    sourcePriceIndex: 80,
    targetPriceIndex: 120,
    suppliedComparison: 140,
  },
  output: { rebasedAmount: 150, comparisonGap: 10 },
} satisfies ToolExample<Input, Output>;
export const historicalMoneyPriceBaseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-money-price-base-gap",
    title: "Historical Money Price Base Gap Tool",
    description:
      "Rebase a signed historical monetary quantity with explicit price indices, not an exchange-rate lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalAmount: { type: "number" },
        sourcePriceIndex: { type: "number", exclusiveMinimum: 0 },
        targetPriceIndex: { type: "number", exclusiveMinimum: 0 },
        suppliedComparison: { type: "number" },
      },
      required: [
        "nominalAmount",
        "sourcePriceIndex",
        "targetPriceIndex",
        "suppliedComparison",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rebasedAmount: { type: "number" },
        comparisonGap: { type: "number" },
      },
      required: ["rebasedAmount", "comparisonGap"],
    },
    ports: {
      inputs: [
        {
          id: "nominalAmount",
          label: "Nominal Amount",
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
          id: "suppliedComparison",
          label: "Supplied Comparison",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rebasedAmount",
          label: "Rebased Amount",
          valueType: { type: "number" },
        },
        {
          id: "comparisonGap",
          label: "Comparison Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalMoneyPriceBaseGapTool.execute;
export default historicalMoneyPriceBaseGapTool;
