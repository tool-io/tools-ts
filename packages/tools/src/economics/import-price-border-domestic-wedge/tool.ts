import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly borderPrice: number;
  readonly domesticPrice: number;
  readonly suppliedExchangeFactor: number;
};
export type Output = {
  readonly convertedBorderPrice: number;
  readonly domesticMinusBorder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    borderPrice: { type: "number", minimum: 0 },
    domesticPrice: { type: "number", minimum: 0 },
    suppliedExchangeFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["borderPrice", "domesticPrice", "suppliedExchangeFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedBorderPrice: { type: "number" },
    domesticMinusBorder: { type: "number" },
  },
  required: ["convertedBorderPrice", "domesticMinusBorder"],
} as const;
/** Compare explicit domestic and exchange-converted border prices without attributing the wedge to tariffs or transport. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { borderPrice, domesticPrice, suppliedExchangeFactor } = request;
  const compute = (): Output => {
    H.domain(borderPrice >= 0 && domesticPrice >= 0, "borderPrice");
    (H.domain(
      Number.isFinite(suppliedExchangeFactor) && suppliedExchangeFactor > 0,
      "suppliedExchangeFactor",
    ),
      suppliedExchangeFactor);
    return {
      convertedBorderPrice: borderPrice * suppliedExchangeFactor,
      domesticMinusBorder: domesticPrice - borderPrice * suppliedExchangeFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { borderPrice: 10, domesticPrice: 15, suppliedExchangeFactor: 1.2 },
  output: { convertedBorderPrice: 12, domesticMinusBorder: 3 },
} satisfies ToolExample<Input, Output>;
export const importPriceBorderDomesticWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/import-price-border-domestic-wedge",
    title: "Import Price Border Domestic Wedge",
    description:
      "Compare explicit domestic and exchange-converted border prices without attributing the wedge to tariffs or transport.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        borderPrice: { type: "number", minimum: 0 },
        domesticPrice: { type: "number", minimum: 0 },
        suppliedExchangeFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["borderPrice", "domesticPrice", "suppliedExchangeFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedBorderPrice: { type: "number" },
        domesticMinusBorder: { type: "number" },
      },
      required: ["convertedBorderPrice", "domesticMinusBorder"],
    },
    ports: {
      inputs: [
        {
          id: "borderPrice",
          label: "Border Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "domesticPrice",
          label: "Domestic Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExchangeFactor",
          label: "Supplied Exchange Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedBorderPrice",
          label: "Converted Border Price",
          valueType: { type: "number" },
        },
        {
          id: "domesticMinusBorder",
          label: "Domestic Minus Border",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = importPriceBorderDomesticWedgeTool.execute;
export default importPriceBorderDomesticWedgeTool;
