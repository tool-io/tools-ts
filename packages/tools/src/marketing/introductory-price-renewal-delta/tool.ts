import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly introductoryPrice: number;
  readonly renewalPrice: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    introductoryPrice: { type: "number" },
    renewalPrice: { type: "number" },
  },
  required: ["introductoryPrice", "renewalPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit introductory price from renewal price on the same currency and period basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { introductoryPrice, renewalPrice } = request;
  const compute = (): Output => {
    return { signedGap: renewalPrice - introductoryPrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { introductoryPrice: 12, renewalPrice: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const introductoryPriceRenewalDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/introductory-price-renewal-delta",
    title: "Introductory Price Renewal Delta",
    description:
      "Subtract an explicit introductory price from renewal price on the same currency and period basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        introductoryPrice: { type: "number" },
        renewalPrice: { type: "number" },
      },
      required: ["introductoryPrice", "renewalPrice"],
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
          id: "introductoryPrice",
          label: "Introductory Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "renewalPrice",
          label: "Renewal Price",
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
export const run = introductoryPriceRenewalDeltaTool.execute;
export default introductoryPriceRenewalDeltaTool;
