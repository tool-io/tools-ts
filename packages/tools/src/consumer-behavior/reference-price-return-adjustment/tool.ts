import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perceivedReference: number;
  readonly purchaseValue: number;
  readonly explicitRefund: number;
  readonly returnedQuantity: number;
  readonly originalQuantity: number;
};
export type Output = {
  readonly netPaid: number;
  readonly referenceOnRetained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perceivedReference: { type: "number", minimum: 0 },
    purchaseValue: { type: "number", minimum: 0 },
    explicitRefund: { type: "number", minimum: 0 },
    returnedQuantity: { type: "number", minimum: 0 },
    originalQuantity: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "perceivedReference",
    "purchaseValue",
    "explicitRefund",
    "returnedQuantity",
    "originalQuantity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netPaid: { type: "number" },
    referenceOnRetained: { type: "number" },
  },
  required: ["netPaid", "referenceOnRetained"],
} as const;
/** Adjust an explicit scalar reference-price basis for retained quantity after a supplied return; no campaign attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    perceivedReference,
    purchaseValue,
    explicitRefund,
    returnedQuantity,
    originalQuantity,
  } = request;
  const compute = (): Output => {
    H.domain(
      perceivedReference >= 0 && purchaseValue >= 0 && explicitRefund >= 0,
    );
    H.positive(originalQuantity);
    H.domain(returnedQuantity >= 0 && returnedQuantity <= originalQuantity);
    return {
      netPaid: purchaseValue - explicitRefund,
      referenceOnRetained:
        (perceivedReference * (originalQuantity - returnedQuantity)) /
        originalQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    perceivedReference: 100,
    purchaseValue: 80,
    explicitRefund: 20,
    returnedQuantity: 1,
    originalQuantity: 4,
  },
  output: { netPaid: 60, referenceOnRetained: 75 },
} satisfies ToolExample<Input, Output>;
export const referencePriceReturnAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/reference-price-return-adjustment",
    title: "Reference Price Return Adjustment Tool",
    description:
      "Adjust an explicit scalar reference-price basis for retained quantity after a supplied return; no campaign attribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perceivedReference: { type: "number", minimum: 0 },
        purchaseValue: { type: "number", minimum: 0 },
        explicitRefund: { type: "number", minimum: 0 },
        returnedQuantity: { type: "number", minimum: 0 },
        originalQuantity: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "perceivedReference",
        "purchaseValue",
        "explicitRefund",
        "returnedQuantity",
        "originalQuantity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netPaid: { type: "number" },
        referenceOnRetained: { type: "number" },
      },
      required: ["netPaid", "referenceOnRetained"],
    },
    ports: {
      inputs: [
        {
          id: "perceivedReference",
          label: "Perceived Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purchaseValue",
          label: "Purchase Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "explicitRefund",
          label: "Explicit Refund",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedQuantity",
          label: "Returned Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalQuantity",
          label: "Original Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netPaid", label: "Net Paid", valueType: { type: "number" } },
        {
          id: "referenceOnRetained",
          label: "Reference On Retained",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = referencePriceReturnAdjustmentTool.execute;
export default referencePriceReturnAdjustmentTool;
