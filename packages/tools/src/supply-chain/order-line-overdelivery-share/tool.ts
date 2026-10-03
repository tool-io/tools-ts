import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly ordered: number; readonly delivered: number };
export type Output = { readonly overdelivery: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ordered: { type: "number", exclusiveMinimum: 0 },
    delivered: { type: "number", minimum: 0 },
  },
  required: ["ordered", "delivered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overdelivery: { type: "number" }, share: { type: "number" } },
  required: ["overdelivery", "share"],
} as const;
/** Calculate order line overdelivery share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ordered, delivered } = request;
  const compute = (): Output => {
    H.positive(ordered);
    H.domain(delivered >= 0);
    return {
      overdelivery: Math.max(0, delivered - ordered),
      share: Math.max(0, delivered - ordered) / ordered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ordered: 100, delivered: 110 },
  output: { overdelivery: 10, share: 0.1 },
} satisfies ToolExample<Input, Output>;
export const orderLineOverdeliveryShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/order-line-overdelivery-share",
    title: "Order Line Overdelivery Share Tool",
    description:
      "Calculate order line overdelivery share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ordered: { type: "number", exclusiveMinimum: 0 },
        delivered: { type: "number", minimum: 0 },
      },
      required: ["ordered", "delivered"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overdelivery: { type: "number" },
        share: { type: "number" },
      },
      required: ["overdelivery", "share"],
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
      ],
      outputs: [
        {
          id: "overdelivery",
          label: "Overdelivery",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orderLineOverdeliveryShareTool.execute;
export default orderLineOverdeliveryShareTool;
