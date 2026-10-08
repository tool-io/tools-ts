import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referencePrice: number;
  readonly displayedPrice: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referencePrice: { type: "number" },
    displayedPrice: { type: "number" },
  },
  required: ["referencePrice", "displayedPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate displayed-minus-reference supplied price on the same unit and currency basis without establishing a lawful reference price. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referencePrice, displayedPrice } = request;
  const compute = (): Output => {
    return { signedGap: displayedPrice - referencePrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referencePrice: 12, displayedPrice: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const promotionReferencePriceDisplayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/promotion-reference-price-display-gap",
    title: "Promotion Reference Price Display Gap",
    description:
      "Calculate displayed-minus-reference supplied price on the same unit and currency basis without establishing a lawful reference price.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referencePrice: { type: "number" },
        displayedPrice: { type: "number" },
      },
      required: ["referencePrice", "displayedPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
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
          id: "displayedPrice",
          label: "Displayed Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = promotionReferencePriceDisplayGapTool.execute;
export default promotionReferencePriceDisplayGapTool;
