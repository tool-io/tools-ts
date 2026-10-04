import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commodityPrice: number;
  readonly numerairePrice: number;
};
export type Output = { readonly relativePrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commodityPrice: { type: "number", minimum: 0 },
    numerairePrice: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["commodityPrice", "numerairePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativePrice: { type: "number" } },
  required: ["relativePrice"],
} as const;
/** Express one nonnegative commodity price in units of a positive-price numeraire, with prices quoted in the same currency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commodityPrice, numerairePrice } = request;
  const compute = (): Output => {
    H.domain(commodityPrice >= 0, "commodityPrice");
    (H.domain(numerairePrice > 0, "numerairePrice"), numerairePrice);
    return { relativePrice: commodityPrice / numerairePrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commodityPrice: 12, numerairePrice: 3 },
  output: { relativePrice: 4 },
} satisfies ToolExample<Input, Output>;
export const commodityNumerairePriceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/commodity-numeraire-price-ratio",
    title: "Commodity Numeraire Price Ratio Tool",
    description:
      "Express one nonnegative commodity price in units of a positive-price numeraire, with prices quoted in the same currency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commodityPrice: { type: "number", minimum: 0 },
        numerairePrice: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["commodityPrice", "numerairePrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relativePrice: { type: "number" } },
      required: ["relativePrice"],
    },
    ports: {
      inputs: [
        {
          id: "commodityPrice",
          label: "Commodity Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "numerairePrice",
          label: "Numeraire Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativePrice",
          label: "Relative Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = commodityNumerairePriceRatioTool.execute;
export default commodityNumerairePriceRatioTool;
