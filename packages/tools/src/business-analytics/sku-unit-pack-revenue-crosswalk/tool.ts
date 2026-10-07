import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packsSold: number;
  readonly unitsPerPack: number;
  readonly pricePerUnit: number;
};
export type Output = { readonly unitsSold: number; readonly revenue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packsSold: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
    pricePerUnit: { type: "number", minimum: 0 },
  },
  required: ["packsSold", "unitsPerPack", "pricePerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unitsSold: { type: "integer" }, revenue: { type: "number" } },
  required: ["unitsSold", "revenue"],
} as const;
/** Extend pack sales into unit quantity and revenue under an explicit per-unit price, excluding discounts, returns and taxes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packsSold, unitsPerPack, pricePerUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(packsSold) &&
        packsSold >= 0 &&
        packsSold <= Number.MAX_SAFE_INTEGER,
      "packsSold",
    ),
      packsSold);
    (H.domain(
      Number.isSafeInteger(unitsPerPack) &&
        unitsPerPack >= 1 &&
        unitsPerPack <= Number.MAX_SAFE_INTEGER,
      "unitsPerPack",
    ),
      unitsPerPack);
    H.domain(pricePerUnit >= 0, "pricePerUnit");
    return {
      unitsSold: packsSold * unitsPerPack,
      revenue: packsSold * unitsPerPack * pricePerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packsSold: 12, unitsPerPack: 6, pricePerUnit: 2.5 },
  output: { unitsSold: 72, revenue: 180 },
} satisfies ToolExample<Input, Output>;
export const skuUnitPackRevenueCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/sku-unit-pack-revenue-crosswalk",
    title: "SKU Unit Pack Revenue Crosswalk",
    description:
      "Extend pack sales into unit quantity and revenue under an explicit per-unit price, excluding discounts, returns and taxes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packsSold: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
        pricePerUnit: { type: "number", minimum: 0 },
      },
      required: ["packsSold", "unitsPerPack", "pricePerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitsSold: { type: "integer" },
        revenue: { type: "number" },
      },
      required: ["unitsSold", "revenue"],
    },
    ports: {
      inputs: [
        {
          id: "packsSold",
          label: "Packs Sold",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerPack",
          label: "Units Per Pack",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pricePerUnit",
          label: "Price Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unitsSold",
          label: "Units Sold",
          valueType: { type: "integer" },
        },
        { id: "revenue", label: "Revenue", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = skuUnitPackRevenueCrosswalkTool.execute;
export default skuUnitPackRevenueCrosswalkTool;
