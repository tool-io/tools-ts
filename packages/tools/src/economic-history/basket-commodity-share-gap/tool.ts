import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commodityCost: number;
  readonly totalBasketCost: number;
  readonly referenceShare: number;
};
export type Output = { readonly share: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commodityCost: { type: "number", minimum: 0 },
    totalBasketCost: { type: "number", exclusiveMinimum: 0 },
    referenceShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["commodityCost", "totalBasketCost", "referenceShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, gap: { type: "number" } },
  required: ["share", "gap"],
} as const;
/** Calculate basket commodity share gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commodityCost, totalBasketCost, referenceShare } = request;
  const compute = (): Output => {
    H.positive(totalBasketCost);
    H.domain(commodityCost >= 0 && commodityCost <= totalBasketCost);
    H.probability(referenceShare);
    return {
      share: commodityCost / totalBasketCost,
      gap: commodityCost / totalBasketCost - referenceShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commodityCost: 20, totalBasketCost: 100, referenceShare: 0.25 },
  output: { share: 0.2, gap: -0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const basketCommodityShareGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/basket-commodity-share-gap",
    title: "Basket Commodity Share Gap Tool",
    description:
      "Calculate basket commodity share gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commodityCost: { type: "number", minimum: 0 },
        totalBasketCost: { type: "number", exclusiveMinimum: 0 },
        referenceShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["commodityCost", "totalBasketCost", "referenceShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, gap: { type: "number" } },
      required: ["share", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "commodityCost",
          label: "Commodity Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBasketCost",
          label: "Total Basket Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceShare",
          label: "Reference Share",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = basketCommodityShareGapTool.execute;
export default basketCommodityShareGapTool;
