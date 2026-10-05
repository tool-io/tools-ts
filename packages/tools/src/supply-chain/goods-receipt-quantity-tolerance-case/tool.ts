import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedQuantity: number;
  readonly receivedQuantity: number;
  readonly underTolerance: number;
  readonly overTolerance: number;
};
export type Output = { readonly variance: number; readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedQuantity: { type: "number", minimum: 0 },
    receivedQuantity: { type: "number", minimum: 0 },
    underTolerance: { type: "number", minimum: 0 },
    overTolerance: { type: "number", minimum: 0 },
  },
  required: [
    "orderedQuantity",
    "receivedQuantity",
    "underTolerance",
    "overTolerance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variance: { type: "number" },
    status: { type: "string", maxLength: 8192 },
  },
  required: ["variance", "status"],
} as const;
/** Classify a goods receipt using explicit absolute under- and over-delivery tolerances, with inclusive allowed boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedQuantity, receivedQuantity, underTolerance, overTolerance } =
    request;
  const compute = (): Output => {
    H.domain(
      orderedQuantity >= 0 &&
        receivedQuantity >= 0 &&
        underTolerance >= 0 &&
        overTolerance >= 0,
      "orderedQuantity",
    );
    const variance = receivedQuantity - orderedQuantity;
    return {
      variance,
      status:
        variance < -underTolerance
          ? "under-tolerance"
          : variance > overTolerance
            ? "over-tolerance"
            : "within-tolerance",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    orderedQuantity: 100,
    receivedQuantity: 98,
    underTolerance: 3,
    overTolerance: 2,
  },
  output: { variance: -2, status: "within-tolerance" },
} satisfies ToolExample<Input, Output>;
export const goodsReceiptQuantityToleranceCaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/goods-receipt-quantity-tolerance-case",
    title: "Goods Receipt Quantity Tolerance Case Tool",
    description:
      "Classify a goods receipt using explicit absolute under- and over-delivery tolerances, with inclusive allowed boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedQuantity: { type: "number", minimum: 0 },
        receivedQuantity: { type: "number", minimum: 0 },
        underTolerance: { type: "number", minimum: 0 },
        overTolerance: { type: "number", minimum: 0 },
      },
      required: [
        "orderedQuantity",
        "receivedQuantity",
        "underTolerance",
        "overTolerance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variance: { type: "number" },
        status: { type: "string", maxLength: 8192 },
      },
      required: ["variance", "status"],
    },
    ports: {
      inputs: [
        {
          id: "orderedQuantity",
          label: "Ordered Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedQuantity",
          label: "Received Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "underTolerance",
          label: "Under Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overTolerance",
          label: "Over Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "variance", label: "Variance", valueType: { type: "number" } },
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = goodsReceiptQuantityToleranceCaseTool.execute;
export default goodsReceiptQuantityToleranceCaseTool;
