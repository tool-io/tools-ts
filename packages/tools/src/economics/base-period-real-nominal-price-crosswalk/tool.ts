import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalAmount: number;
  readonly priceIndex: number;
  readonly indexBase: number;
};
export type Output = { readonly realAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalAmount: { type: "number" },
    priceIndex: { type: "number", exclusiveMinimum: 0 },
    indexBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nominalAmount", "priceIndex", "indexBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realAmount: { type: "number" } },
  required: ["realAmount"],
} as const;
/** Deflate a signed nominal monetary amount using a positive price index with its explicitly supplied base scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalAmount, priceIndex, indexBase } = request;
  const compute = (): Output => {
    (H.domain(priceIndex > 0, "priceIndex"), priceIndex);
    (H.domain(indexBase > 0, "indexBase"), indexBase);
    return { realAmount: (nominalAmount * indexBase) / priceIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalAmount: 1200, priceIndex: 120, indexBase: 100 },
  output: { realAmount: 1000 },
} satisfies ToolExample<Input, Output>;
export const basePeriodRealNominalPriceCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/base-period-real-nominal-price-crosswalk",
      title: "Base Period Real Nominal Price Crosswalk Tool",
      description:
        "Deflate a signed nominal monetary amount using a positive price index with its explicitly supplied base scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalAmount: { type: "number" },
          priceIndex: { type: "number", exclusiveMinimum: 0 },
          indexBase: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["nominalAmount", "priceIndex", "indexBase"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { realAmount: { type: "number" } },
        required: ["realAmount"],
      },
      ports: {
        inputs: [
          {
            id: "nominalAmount",
            label: "Nominal Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "priceIndex",
            label: "Price Index",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "indexBase",
            label: "Index Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "realAmount",
            label: "Real Amount",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = basePeriodRealNominalPriceCrosswalkTool.execute;
export default basePeriodRealNominalPriceCrosswalkTool;
