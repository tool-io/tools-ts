import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePrice: number;
  readonly promotionPrice: number;
};
export type Output = {
  readonly priceFactor: number;
  readonly signedUplift: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePrice: { type: "number", exclusiveMinimum: 0 },
    promotionPrice: { type: "number", minimum: 0 },
  },
  required: ["referencePrice", "promotionPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priceFactor: { type: "number" },
    signedUplift: { type: "number" },
  },
  required: ["priceFactor", "signedUplift"],
} as const;
/** Calculate promotion price uplift factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePrice, promotionPrice } = request;
  const compute = (): Output => {
    H.positive(referencePrice);
    H.domain(promotionPrice >= 0);
    return {
      priceFactor: promotionPrice / referencePrice,
      signedUplift: (promotionPrice - referencePrice) / referencePrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referencePrice: 100, promotionPrice: 80 },
  output: { priceFactor: 0.8, signedUplift: -0.2 },
} satisfies ToolExample<Input, Output>;
export const promotionPriceUpliftFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/promotion-price-uplift-factor",
    title: "Promotion Price Uplift Factor Tool",
    description:
      "Calculate promotion price uplift factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referencePrice: { type: "number", exclusiveMinimum: 0 },
        promotionPrice: { type: "number", minimum: 0 },
      },
      required: ["referencePrice", "promotionPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priceFactor: { type: "number" },
        signedUplift: { type: "number" },
      },
      required: ["priceFactor", "signedUplift"],
    },
    ports: {
      inputs: [
        {
          id: "referencePrice",
          label: "Reference Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "promotionPrice",
          label: "Promotion Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priceFactor",
          label: "Price Factor",
          valueType: { type: "number" },
        },
        {
          id: "signedUplift",
          label: "Signed Uplift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = promotionPriceUpliftFactorTool.execute;
export default promotionPriceUpliftFactorTool;
