import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemValues: readonly number[];
  readonly excluded: readonly boolean[];
  readonly discountFraction: number;
};
export type Output = {
  readonly base: number;
  readonly discount: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemValues: { type: "array", maxItems: 256, items: { type: "number" } },
    excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
    discountFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["itemValues", "excluded", "discountFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    base: { type: "number" },
    discount: { type: "number" },
    total: { type: "number" },
  },
  required: ["base", "discount", "total"],
} as const;
/** Calculate basket discount base exclusion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemValues, excluded, discountFraction } = request;
  const compute = (): Output => {
    H.sameLength(itemValues, excluded);
    H.domain(itemValues.every((x) => x >= 0));
    H.probability(discountFraction);
    return {
      base: itemValues.reduce((s, x, i) => s + (excluded[i] ? 0 : x), 0),
      discount:
        itemValues.reduce((s, x, i) => s + (excluded[i] ? 0 : x), 0) *
        discountFraction,
      total:
        itemValues.reduce((a, b) => a + b, 0) -
        itemValues.reduce((s, x, i) => s + (excluded[i] ? 0 : x), 0) *
          discountFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemValues: [20, 30],
    excluded: [false, true],
    discountFraction: 0.1,
  },
  output: { base: 20, discount: 2, total: 48 },
} satisfies ToolExample<Input, Output>;
export const basketDiscountBaseExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/basket-discount-base-exclusion",
    title: "Basket Discount Base Exclusion Tool",
    description:
      "Calculate basket discount base exclusion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemValues: { type: "array", maxItems: 256, items: { type: "number" } },
        excluded: { type: "array", maxItems: 256, items: { type: "boolean" } },
        discountFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["itemValues", "excluded", "discountFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        base: { type: "number" },
        discount: { type: "number" },
        total: { type: "number" },
      },
      required: ["base", "discount", "total"],
    },
    ports: {
      inputs: [
        {
          id: "itemValues",
          label: "Item Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "discountFraction",
          label: "Discount Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        { id: "base", label: "Base", valueType: { type: "number" } },
        { id: "discount", label: "Discount", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = basketDiscountBaseExclusionTool.execute;
export default basketDiscountBaseExclusionTool;
