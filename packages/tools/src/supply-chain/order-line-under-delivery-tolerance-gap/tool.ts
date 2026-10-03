import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ordered: number;
  readonly delivered: number;
  readonly suppliedTolerance: number;
};
export type Output = {
  readonly shortfall: number;
  readonly allowable: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ordered: { type: "number", minimum: 0 },
    delivered: { type: "number", minimum: 0 },
    suppliedTolerance: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["ordered", "delivered", "suppliedTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "number" },
    allowable: { type: "number" },
    margin: { type: "number" },
  },
  required: ["shortfall", "allowable", "margin"],
} as const;
/** Calculate order line under delivery tolerance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ordered, delivered, suppliedTolerance } = request;
  const compute = (): Output => {
    H.domain(ordered >= 0 && delivered >= 0);
    H.probability(suppliedTolerance);
    return {
      shortfall: Math.max(0, ordered - delivered),
      allowable: ordered * suppliedTolerance,
      margin: ordered * suppliedTolerance - Math.max(0, ordered - delivered),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ordered: 100, delivered: 94, suppliedTolerance: 0.05 },
  output: { shortfall: 6, allowable: 5, margin: -1 },
} satisfies ToolExample<Input, Output>;
export const orderLineUnderDeliveryToleranceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/order-line-under-delivery-tolerance-gap",
    title: "Order Line Under Delivery Tolerance Gap Tool",
    description:
      "Calculate order line under delivery tolerance gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "number", minimum: 0 },
        delivered: { type: "number", minimum: 0 },
        suppliedTolerance: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["ordered", "delivered", "suppliedTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        allowable: { type: "number" },
        margin: { type: "number" },
      },
      required: ["shortfall", "allowable", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "ordered",
          label: "Ordered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delivered",
          label: "Delivered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        { id: "allowable", label: "Allowable", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orderLineUnderDeliveryToleranceGapTool.execute;
export default orderLineUnderDeliveryToleranceGapTool;
