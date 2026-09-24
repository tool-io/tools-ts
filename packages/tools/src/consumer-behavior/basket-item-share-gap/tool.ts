import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemValue: number;
  readonly basketValue: number;
  readonly referenceShare: number;
};
export type Output = { readonly share: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemValue: { type: "number", minimum: 0 },
    basketValue: { type: "number", exclusiveMinimum: 0 },
    referenceShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["itemValue", "basketValue", "referenceShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, gap: { type: "number" } },
  required: ["share", "gap"],
} as const;
/** Calculate basket item share gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemValue, basketValue, referenceShare } = request;
  const compute = (): Output => {
    H.positive(basketValue);
    H.domain(itemValue >= 0 && itemValue <= basketValue);
    H.probability(referenceShare);
    return {
      share: itemValue / basketValue,
      gap: itemValue / basketValue - referenceShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemValue: 20, basketValue: 100, referenceShare: 0.25 },
  output: { share: 0.2, gap: -0.04999999999999999 },
} satisfies ToolExample<Input, Output>;
export const basketItemShareGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "consumer-behavior/basket-item-share-gap",
    title: "Basket Item Share Gap Tool",
    description:
      "Calculate basket item share gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemValue: { type: "number", minimum: 0 },
        basketValue: { type: "number", exclusiveMinimum: 0 },
        referenceShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["itemValue", "basketValue", "referenceShare"],
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
          id: "itemValue",
          label: "Item Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basketValue",
          label: "Basket Value",
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
export const run = basketItemShareGapTool.execute;
export default basketItemShareGapTool;
