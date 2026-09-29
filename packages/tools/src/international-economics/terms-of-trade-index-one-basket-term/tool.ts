import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exportPriceIndex: number;
  readonly importPriceIndex: number;
  readonly referenceScale: number;
};
export type Output = { readonly termsOfTrade: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exportPriceIndex: { type: "number", exclusiveMinimum: 0 },
    importPriceIndex: { type: "number", exclusiveMinimum: 0 },
    referenceScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["exportPriceIndex", "importPriceIndex", "referenceScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { termsOfTrade: { type: "number" } },
  required: ["termsOfTrade"],
} as const;
/** Calculate terms of trade index one basket term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exportPriceIndex, importPriceIndex, referenceScale } = request;
  const compute = (): Output => {
    H.positive(exportPriceIndex);
    H.positive(importPriceIndex);
    H.positive(referenceScale);
    return {
      termsOfTrade: (referenceScale * exportPriceIndex) / importPriceIndex,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exportPriceIndex: 120, importPriceIndex: 100, referenceScale: 100 },
  output: { termsOfTrade: 120 },
} satisfies ToolExample<Input, Output>;
export const termsOfTradeIndexOneBasketTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/terms-of-trade-index-one-basket-term",
    title: "Terms Of Trade Index One Basket Term Tool",
    description:
      "Calculate terms of trade index one basket term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exportPriceIndex: { type: "number", exclusiveMinimum: 0 },
        importPriceIndex: { type: "number", exclusiveMinimum: 0 },
        referenceScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["exportPriceIndex", "importPriceIndex", "referenceScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { termsOfTrade: { type: "number" } },
      required: ["termsOfTrade"],
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
          id: "referenceScale",
          label: "Reference Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "termsOfTrade",
          label: "Terms Of Trade",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = termsOfTradeIndexOneBasketTermTool.execute;
export default termsOfTradeIndexOneBasketTermTool;
