import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly salePrice: number;
  readonly feeRateFraction: number;
  readonly fixedFee: number;
};
export type Output = {
  readonly totalFee: number;
  readonly netBeforeOtherCosts: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salePrice: { type: "number", minimum: 0 },
    feeRateFraction: { type: "number", minimum: 0 },
    fixedFee: { type: "number", minimum: 0 },
  },
  required: ["salePrice", "feeRateFraction", "fixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFee: { type: "number" },
    netBeforeOtherCosts: { type: "number" },
  },
  required: ["totalFee", "netBeforeOtherCosts"],
} as const;
/** Apply an explicit percentage-plus-fixed closing fee to a property sale, excluding tax and other unspecified costs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { salePrice, feeRateFraction, fixedFee } = request;
  const compute = (): Output => {
    H.domain(
      salePrice >= 0 && feeRateFraction >= 0 && fixedFee >= 0,
      "salePrice",
    );
    return {
      totalFee: salePrice * feeRateFraction + fixedFee,
      netBeforeOtherCosts: salePrice * (1 - feeRateFraction) - fixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { salePrice: 200000, feeRateFraction: 0.02, fixedFee: 500 },
  output: { totalFee: 4500, netBeforeOtherCosts: 195500 },
} satisfies ToolExample<Input, Output>;
export const propertySaleClosingFeeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/property-sale-closing-fee",
    title: "Property Sale Closing Fee",
    description:
      "Apply an explicit percentage-plus-fixed closing fee to a property sale, excluding tax and other unspecified costs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        salePrice: { type: "number", minimum: 0 },
        feeRateFraction: { type: "number", minimum: 0 },
        fixedFee: { type: "number", minimum: 0 },
      },
      required: ["salePrice", "feeRateFraction", "fixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFee: { type: "number" },
        netBeforeOtherCosts: { type: "number" },
      },
      required: ["totalFee", "netBeforeOtherCosts"],
    },
    ports: {
      inputs: [
        {
          id: "salePrice",
          label: "Sale Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feeRateFraction",
          label: "Fee Rate Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
        {
          id: "netBeforeOtherCosts",
          label: "Net Before Other Costs",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propertySaleClosingFeeTool.execute;
export default propertySaleClosingFeeTool;
