import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capturePrice: number;
  readonly referenceMarketPrice: number;
};
export type Output = {
  readonly signedPriceGap: number;
  readonly relativeDiscount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capturePrice: { type: "number" },
    referenceMarketPrice: { type: "number" },
  },
  required: ["capturePrice", "referenceMarketPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedPriceGap: { type: "number" },
    relativeDiscount: { type: "number" },
  },
  required: ["signedPriceGap", "relativeDiscount"],
} as const;
/** Describe an explicit capture-price difference relative to a nonzero market reference, retaining negative prices and premiums. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capturePrice, referenceMarketPrice } = request;
  const compute = (): Output => {
    H.domain(referenceMarketPrice !== 0, "referenceMarketPrice");
    return {
      signedPriceGap: referenceMarketPrice - capturePrice,
      relativeDiscount:
        (referenceMarketPrice - capturePrice) / referenceMarketPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capturePrice: 40, referenceMarketPrice: 50 },
  output: { signedPriceGap: 10, relativeDiscount: 0.2 },
} satisfies ToolExample<Input, Output>;
export const renewableCapturePriceDiscountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/renewable-capture-price-discount",
    title: "Renewable Capture Price Discount",
    description:
      "Describe an explicit capture-price difference relative to a nonzero market reference, retaining negative prices and premiums.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capturePrice: { type: "number" },
        referenceMarketPrice: { type: "number" },
      },
      required: ["capturePrice", "referenceMarketPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedPriceGap: { type: "number" },
        relativeDiscount: { type: "number" },
      },
      required: ["signedPriceGap", "relativeDiscount"],
    },
    ports: {
      inputs: [
        {
          id: "capturePrice",
          label: "Capture Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceMarketPrice",
          label: "Reference Market Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedPriceGap",
          label: "Signed Price Gap",
          valueType: { type: "number" },
        },
        {
          id: "relativeDiscount",
          label: "Relative Discount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = renewableCapturePriceDiscountTool.execute;
export default renewableCapturePriceDiscountTool;
