import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exportPriceIndex: number;
  readonly importPriceIndex: number;
  readonly base: number;
};
export type Output = { readonly termsOfTradeIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportPriceIndex: { type: "number", exclusiveMinimum: 0 },
    importPriceIndex: { type: "number", exclusiveMinimum: 0 },
    base: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exportPriceIndex", "importPriceIndex", "base"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { termsOfTradeIndex: { type: "number" } },
  required: ["termsOfTradeIndex"],
} as const;
/** Take an explicit export-to-import price-index ratio with a caller-supplied base without constructing comparable indices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exportPriceIndex, importPriceIndex, base } = request;
  const compute = (): Output => {
    (H.domain(exportPriceIndex > 0, "exportPriceIndex"), exportPriceIndex);
    (H.domain(importPriceIndex > 0, "importPriceIndex"), importPriceIndex);
    (H.domain(base > 0, "base"), base);
    return { termsOfTradeIndex: (base * exportPriceIndex) / importPriceIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exportPriceIndex: 120, importPriceIndex: 100, base: 100 },
  output: { termsOfTradeIndex: 120 },
} satisfies ToolExample<Input, Output>;
export const termsOfTradePriceRelativeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/terms-of-trade-price-relative",
    title: "Terms Of Trade Price Relative",
    description:
      "Take an explicit export-to-import price-index ratio with a caller-supplied base without constructing comparable indices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exportPriceIndex: { type: "number", exclusiveMinimum: 0 },
        importPriceIndex: { type: "number", exclusiveMinimum: 0 },
        base: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exportPriceIndex", "importPriceIndex", "base"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { termsOfTradeIndex: { type: "number" } },
      required: ["termsOfTradeIndex"],
    },
    ports: {
      inputs: [
        {
          id: "exportPriceIndex",
          label: "Export Price Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "importPriceIndex",
          label: "Import Price Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "termsOfTradeIndex",
          label: "Terms Of Trade Index",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = termsOfTradePriceRelativeTool.execute;
export default termsOfTradePriceRelativeTool;
