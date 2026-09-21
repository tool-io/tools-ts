import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basePrice: number;
  readonly premium: number;
  readonly premiumIsFraction: boolean;
  readonly acceptedQuantity: number;
};
export type Output = { readonly unitPrice: number; readonly payment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basePrice: { type: "number", minimum: 0 },
    premium: { type: "number", minimum: 0 },
    premiumIsFraction: { type: "boolean" },
    acceptedQuantity: { type: "number", minimum: 0 },
  },
  required: ["basePrice", "premium", "premiumIsFraction", "acceptedQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unitPrice: { type: "number" }, payment: { type: "number" } },
  required: ["unitPrice", "payment"],
} as const;
/** Calculate produce grade premium price base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basePrice, premium, premiumIsFraction, acceptedQuantity } = request;
  const compute = (): Output => {
    H.domain(basePrice >= 0 && premium >= 0 && acceptedQuantity >= 0);
    return {
      unitPrice:
        basePrice + (premiumIsFraction ? basePrice * premium : premium),
      payment:
        acceptedQuantity *
        (basePrice + (premiumIsFraction ? basePrice * premium : premium)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    basePrice: 10,
    premium: 0.2,
    premiumIsFraction: true,
    acceptedQuantity: 100,
  },
  output: { unitPrice: 12, payment: 1200 },
} satisfies ToolExample<Input, Output>;
export const produceGradePremiumPriceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/produce-grade-premium-price-base",
    title: "Produce Grade Premium Price Base Tool",
    description:
      "Calculate produce grade premium price base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basePrice: { type: "number", minimum: 0 },
        premium: { type: "number", minimum: 0 },
        premiumIsFraction: { type: "boolean" },
        acceptedQuantity: { type: "number", minimum: 0 },
      },
      required: [
        "basePrice",
        "premium",
        "premiumIsFraction",
        "acceptedQuantity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitPrice: { type: "number" },
        payment: { type: "number" },
      },
      required: ["unitPrice", "payment"],
    },
    ports: {
      inputs: [
        {
          id: "basePrice",
          label: "Base Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "premium",
          label: "Premium",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "premiumIsFraction",
          label: "Premium Is Fraction",
          required: true,
          valueType: { type: "boolean", unit: "1" },
        },
        {
          id: "acceptedQuantity",
          label: "Accepted Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unitPrice", label: "Unit Price", valueType: { type: "number" } },
        { id: "payment", label: "Payment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = produceGradePremiumPriceBaseTool.execute;
export default produceGradePremiumPriceBaseTool;
