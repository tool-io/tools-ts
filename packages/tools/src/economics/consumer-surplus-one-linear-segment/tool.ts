import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWillingness: number;
  readonly lastWillingness: number;
  readonly price: number;
  readonly quantity: number;
};
export type Output = { readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWillingness: { type: "number" },
    lastWillingness: { type: "number" },
    price: { type: "number" },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["firstWillingness", "lastWillingness", "price", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { surplus: { type: "number" } },
  required: ["surplus"],
} as const;
/** Integrate the signed surplus of one explicitly linear willingness-to-pay segment above a fixed price. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWillingness, lastWillingness, price, quantity } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return {
      surplus: quantity * ((firstWillingness + lastWillingness) / 2 - price),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstWillingness: 20, lastWillingness: 10, price: 8, quantity: 4 },
  output: { surplus: 28 },
} satisfies ToolExample<Input, Output>;
export const consumerSurplusOneLinearSegmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/consumer-surplus-one-linear-segment",
    title: "Consumer Surplus One Linear Segment Tool",
    description:
      "Integrate the signed surplus of one explicitly linear willingness-to-pay segment above a fixed price.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWillingness: { type: "number" },
        lastWillingness: { type: "number" },
        price: { type: "number" },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["firstWillingness", "lastWillingness", "price", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { surplus: { type: "number" } },
      required: ["surplus"],
    },
    ports: {
      inputs: [
        {
          id: "firstWillingness",
          label: "First Willingness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastWillingness",
          label: "Last Willingness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = consumerSurplusOneLinearSegmentTool.execute;
export default consumerSurplusOneLinearSegmentTool;
