import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ordered: number;
  readonly delivered: number;
  readonly canceled: number;
  readonly allocated: number;
};
export type Output = {
  readonly backorder: number;
  readonly unallocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ordered: { type: "integer", minimum: 0 },
    delivered: { type: "integer", minimum: 0 },
    canceled: { type: "integer", minimum: 0 },
    allocated: { type: "integer", minimum: 0 },
  },
  required: ["ordered", "delivered", "canceled", "allocated"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    backorder: { type: "integer" },
    unallocated: { type: "integer" },
  },
  required: ["backorder", "unallocated"],
} as const;
/** Calculate backorder partial delivery balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ordered, delivered, canceled, allocated } = request;
  const compute = (): Output => {
    H.integer(ordered, 0);
    H.integer(delivered, 0, ordered);
    H.integer(canceled, 0, ordered - delivered);
    H.integer(allocated, 0, ordered - delivered - canceled);
    return {
      backorder: ordered - delivered - canceled,
      unallocated: ordered - delivered - canceled - allocated,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ordered: 100, delivered: 60, canceled: 10, allocated: 20 },
  output: { backorder: 30, unallocated: 10 },
} satisfies ToolExample<Input, Output>;
export const backorderPartialDeliveryBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/backorder-partial-delivery-balance",
    title: "Backorder Partial Delivery Balance Tool",
    description:
      "Calculate backorder partial delivery balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "integer", minimum: 0 },
        delivered: { type: "integer", minimum: 0 },
        canceled: { type: "integer", minimum: 0 },
        allocated: { type: "integer", minimum: 0 },
      },
      required: ["ordered", "delivered", "canceled", "allocated"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        backorder: { type: "integer" },
        unallocated: { type: "integer" },
      },
      required: ["backorder", "unallocated"],
    },
    ports: {
      inputs: [
        {
          id: "ordered",
          label: "Ordered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "delivered",
          label: "Delivered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "canceled",
          label: "Canceled",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allocated",
          label: "Allocated",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "backorder", label: "Backorder", valueType: { type: "integer" } },
        {
          id: "unallocated",
          label: "Unallocated",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = backorderPartialDeliveryBalanceTool.execute;
export default backorderPartialDeliveryBalanceTool;
