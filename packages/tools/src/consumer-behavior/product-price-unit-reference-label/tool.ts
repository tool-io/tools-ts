import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly currencyCode: string;
  readonly referenceQuantity: number;
  readonly unit: string;
};
export type Output = { readonly label: string; readonly pricePerUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number", minimum: 0 },
    currencyCode: { type: "string", maxLength: 8192, minLength: 1 },
    referenceQuantity: { type: "number", exclusiveMinimum: 0 },
    unit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["price", "currencyCode", "referenceQuantity", "unit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    pricePerUnit: { type: "number" },
  },
  required: ["label", "pricePerUnit"],
} as const;
/** Label an explicit product price and reference quantity while retaining its per-unit equivalent without currency conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, currencyCode, referenceQuantity, unit } = request;
  const compute = (): Output => {
    H.domain(price >= 0 && currencyCode.length > 0 && unit.length > 0, "price");
    (H.domain(referenceQuantity > 0, "referenceQuantity"), referenceQuantity);
    return {
      label:
        currencyCode + " " + price + " per " + referenceQuantity + " " + unit,
      pricePerUnit: price / referenceQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 6, currencyCode: "USD", referenceQuantity: 3, unit: "kg" },
  output: { label: "USD 6 per 3 kg", pricePerUnit: 2 },
} satisfies ToolExample<Input, Output>;
export const productPriceUnitReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/product-price-unit-reference-label",
    title: "Product Price Unit Reference Label",
    description:
      "Label an explicit product price and reference quantity while retaining its per-unit equivalent without currency conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number", minimum: 0 },
        currencyCode: { type: "string", maxLength: 8192, minLength: 1 },
        referenceQuantity: { type: "number", exclusiveMinimum: 0 },
        unit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["price", "currencyCode", "referenceQuantity", "unit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        pricePerUnit: { type: "number" },
      },
      required: ["label", "pricePerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currencyCode",
          label: "Currency Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceQuantity",
          label: "Reference Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unit",
          label: "Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "pricePerUnit",
          label: "Price Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = productPriceUnitReferenceLabelTool.execute;
export default productPriceUnitReferenceLabelTool;
