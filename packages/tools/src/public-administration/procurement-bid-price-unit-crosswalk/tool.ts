import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotedPrice: number;
  readonly quotedQuantity: number;
  readonly suppliedTargetQuantity: number;
};
export type Output = { readonly priceForTargetQuantity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedPrice: { type: "number", minimum: 0 },
    quotedQuantity: { type: "number", exclusiveMinimum: 0 },
    suppliedTargetQuantity: { type: "number", minimum: 0 },
  },
  required: ["quotedPrice", "quotedQuantity", "suppliedTargetQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priceForTargetQuantity: { type: "number" } },
  required: ["priceForTargetQuantity"],
} as const;
/** Rebase an explicit procurement quote to a supplied compatible quantity without comparing unlike bid specifications. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quotedPrice, quotedQuantity, suppliedTargetQuantity } = request;
  const compute = (): Output => {
    H.domain(quotedPrice >= 0 && suppliedTargetQuantity >= 0, "quotedPrice");
    (H.domain(
      Number.isFinite(quotedQuantity) && quotedQuantity > 0,
      "quotedQuantity",
    ),
      quotedQuantity);
    return {
      priceForTargetQuantity:
        (quotedPrice / quotedQuantity) * suppliedTargetQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quotedPrice: 120, quotedQuantity: 12, suppliedTargetQuantity: 5 },
  output: { priceForTargetQuantity: 50 },
} satisfies ToolExample<Input, Output>;
export const procurementBidPriceUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/procurement-bid-price-unit-crosswalk",
    title: "Procurement Bid Price Unit Crosswalk",
    description:
      "Rebase an explicit procurement quote to a supplied compatible quantity without comparing unlike bid specifications.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotedPrice: { type: "number", minimum: 0 },
        quotedQuantity: { type: "number", exclusiveMinimum: 0 },
        suppliedTargetQuantity: { type: "number", minimum: 0 },
      },
      required: ["quotedPrice", "quotedQuantity", "suppliedTargetQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { priceForTargetQuantity: { type: "number" } },
      required: ["priceForTargetQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "quotedPrice",
          label: "Quoted Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quotedQuantity",
          label: "Quoted Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTargetQuantity",
          label: "Supplied Target Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priceForTargetQuantity",
          label: "Price For Target Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = procurementBidPriceUnitCrosswalkTool.execute;
export default procurementBidPriceUnitCrosswalkTool;
