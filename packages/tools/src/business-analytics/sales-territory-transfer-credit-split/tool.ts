import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly saleValue: number;
  readonly originalFraction: number;
  readonly receivingFraction: number;
  readonly unallocatedFraction: number;
};
export type Output = {
  readonly originalCredit: number;
  readonly receivingCredit: number;
  readonly unallocatedCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saleValue: { type: "number", minimum: 0 },
    originalFraction: { type: "number", minimum: 0, maximum: 1 },
    receivingFraction: { type: "number", minimum: 0, maximum: 1 },
    unallocatedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "saleValue",
    "originalFraction",
    "receivingFraction",
    "unallocatedFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalCredit: { type: "number" },
    receivingCredit: { type: "number" },
    unallocatedCredit: { type: "number" },
  },
  required: ["originalCredit", "receivingCredit", "unallocatedCredit"],
} as const;
/** Calculate sales territory transfer credit split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    saleValue,
    originalFraction,
    receivingFraction,
    unallocatedFraction,
  } = request;
  const compute = (): Output => {
    H.domain(saleValue >= 0);
    H.probability(originalFraction);
    H.probability(receivingFraction);
    H.probability(unallocatedFraction);
    H.domain(
      Math.abs(
        originalFraction + receivingFraction + unallocatedFraction - 1,
      ) <= 1e-12,
    );
    return {
      originalCredit: saleValue * originalFraction,
      receivingCredit: saleValue * receivingFraction,
      unallocatedCredit: saleValue * unallocatedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    saleValue: 1000,
    originalFraction: 0.3,
    receivingFraction: 0.5,
    unallocatedFraction: 0.2,
  },
  output: { originalCredit: 300, receivingCredit: 500, unallocatedCredit: 200 },
} satisfies ToolExample<Input, Output>;
export const salesTerritoryTransferCreditSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/sales-territory-transfer-credit-split",
    title: "Sales Territory Transfer Credit Split Tool",
    description:
      "Calculate sales territory transfer credit split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saleValue: { type: "number", minimum: 0 },
        originalFraction: { type: "number", minimum: 0, maximum: 1 },
        receivingFraction: { type: "number", minimum: 0, maximum: 1 },
        unallocatedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "saleValue",
        "originalFraction",
        "receivingFraction",
        "unallocatedFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalCredit: { type: "number" },
        receivingCredit: { type: "number" },
        unallocatedCredit: { type: "number" },
      },
      required: ["originalCredit", "receivingCredit", "unallocatedCredit"],
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
          id: "originalFraction",
          label: "Original Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivingFraction",
          label: "Receiving Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unallocatedFraction",
          label: "Unallocated Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "originalCredit",
          label: "Original Credit",
          valueType: { type: "number" },
        },
        {
          id: "receivingCredit",
          label: "Receiving Credit",
          valueType: { type: "number" },
        },
        {
          id: "unallocatedCredit",
          label: "Unallocated Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = salesTerritoryTransferCreditSplitTool.execute;
export default salesTerritoryTransferCreditSplitTool;
