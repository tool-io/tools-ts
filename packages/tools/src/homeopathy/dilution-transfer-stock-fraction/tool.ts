import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockVolume: number;
  readonly diluentVolume: number;
};
export type Output = { readonly stockFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockVolume: { type: "number", minimum: 0 },
    diluentVolume: { type: "number", minimum: 0 },
  },
  required: ["stockVolume", "diluentVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stockFraction: { type: "number" } },
  required: ["stockFraction"],
} as const;
/** Compute the stock-volume fraction of explicitly additive stock and diluent volumes without modeling active ingredients or efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockVolume, diluentVolume } = request;
  const compute = (): Output => {
    H.domain(stockVolume >= 0 && diluentVolume >= 0, "stockVolume");
    (H.domain(stockVolume + diluentVolume > 0, "stockVolume"),
      stockVolume + diluentVolume);
    return { stockFraction: stockVolume / (stockVolume + diluentVolume) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stockVolume: 2, diluentVolume: 18 },
  output: { stockFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const dilutionTransferStockFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/dilution-transfer-stock-fraction",
    title: "Dilution Transfer Stock Fraction",
    description:
      "Compute the stock-volume fraction of explicitly additive stock and diluent volumes without modeling active ingredients or efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockVolume: { type: "number", minimum: 0 },
        diluentVolume: { type: "number", minimum: 0 },
      },
      required: ["stockVolume", "diluentVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stockFraction: { type: "number" } },
      required: ["stockFraction"],
    },
    ports: {
      inputs: [
        {
          id: "stockVolume",
          label: "Stock Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diluentVolume",
          label: "Diluent Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stockFraction",
          label: "Stock Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dilutionTransferStockFractionTool.execute;
export default dilutionTransferStockFractionTool;
