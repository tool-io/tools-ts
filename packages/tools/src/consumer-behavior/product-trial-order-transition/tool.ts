import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousProduct: string;
  readonly nextProduct: string;
  readonly suppliedOrder: readonly string[];
};
export type Output = {
  readonly repeated: boolean;
  readonly bothKnown: boolean;
  readonly orderDelta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousProduct: { type: "string", maxLength: 8192 },
    nextProduct: { type: "string", maxLength: 8192 },
    suppliedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["previousProduct", "nextProduct", "suppliedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repeated: { type: "boolean" },
    bothKnown: { type: "boolean" },
    orderDelta: { type: "integer" },
  },
  required: ["repeated", "bothKnown", "orderDelta"],
} as const;
/** Calculate product trial order transition from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousProduct, nextProduct, suppliedOrder } = request;
  const compute = (): Output => {
    H.domain(new Set(suppliedOrder).size === suppliedOrder.length);
    return {
      repeated: previousProduct === nextProduct,
      bothKnown:
        suppliedOrder.includes(previousProduct) &&
        suppliedOrder.includes(nextProduct),
      orderDelta:
        suppliedOrder.includes(previousProduct) &&
        suppliedOrder.includes(nextProduct)
          ? suppliedOrder.indexOf(nextProduct) -
            suppliedOrder.indexOf(previousProduct)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousProduct: "A",
    nextProduct: "C",
    suppliedOrder: ["A", "B", "C"],
  },
  output: { repeated: false, bothKnown: true, orderDelta: 2 },
} satisfies ToolExample<Input, Output>;
export const productTrialOrderTransitionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/product-trial-order-transition",
    title: "Product Trial Order Transition Tool",
    description:
      "Calculate product trial order transition from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousProduct: { type: "string", maxLength: 8192 },
        nextProduct: { type: "string", maxLength: 8192 },
        suppliedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["previousProduct", "nextProduct", "suppliedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repeated: { type: "boolean" },
        bothKnown: { type: "boolean" },
        orderDelta: { type: "integer" },
      },
      required: ["repeated", "bothKnown", "orderDelta"],
    },
    ports: {
      inputs: [
        {
          id: "previousProduct",
          label: "Previous Product",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "nextProduct",
          label: "Next Product",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOrder",
          label: "Supplied Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "repeated", label: "Repeated", valueType: { type: "boolean" } },
        {
          id: "bothKnown",
          label: "Both Known",
          valueType: { type: "boolean" },
        },
        {
          id: "orderDelta",
          label: "Order Delta",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = productTrialOrderTransitionTool.execute;
export default productTrialOrderTransitionTool;
