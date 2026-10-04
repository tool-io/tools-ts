import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exclusivePrice: number;
  readonly taxRateFraction: number;
};
export type Output = {
  readonly taxAmount: number;
  readonly inclusivePrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exclusivePrice: { type: "number", minimum: 0 },
    taxRateFraction: { type: "number", minimum: 0 },
  },
  required: ["exclusivePrice", "taxRateFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxAmount: { type: "number" },
    inclusivePrice: { type: "number" },
  },
  required: ["taxAmount", "inclusivePrice"],
} as const;
/** Apply a caller-specified nonnegative ad valorem tax rate to a tax-exclusive price; no jurisdictional rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exclusivePrice, taxRateFraction } = request;
  const compute = (): Output => {
    H.domain(exclusivePrice >= 0 && taxRateFraction >= 0, "exclusivePrice");
    return {
      taxAmount: exclusivePrice * taxRateFraction,
      inclusivePrice: exclusivePrice * (1 + taxRateFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exclusivePrice: 80, taxRateFraction: 0.25 },
  output: { taxAmount: 20, inclusivePrice: 100 },
} satisfies ToolExample<Input, Output>;
export const advaloremTaxExclusiveInclusivePriceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/advalorem-tax-exclusive-inclusive-price",
      title: "Advalorem Tax Exclusive Inclusive Price Tool",
      description:
        "Apply a caller-specified nonnegative ad valorem tax rate to a tax-exclusive price; no jurisdictional rule is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exclusivePrice: { type: "number", minimum: 0 },
          taxRateFraction: { type: "number", minimum: 0 },
        },
        required: ["exclusivePrice", "taxRateFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          taxAmount: { type: "number" },
          inclusivePrice: { type: "number" },
        },
        required: ["taxAmount", "inclusivePrice"],
      },
      ports: {
        inputs: [
          {
            id: "exclusivePrice",
            label: "Exclusive Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "taxRateFraction",
            label: "Tax Rate Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "taxAmount",
            label: "Tax Amount",
            valueType: { type: "number" },
          },
          {
            id: "inclusivePrice",
            label: "Inclusive Price",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = advaloremTaxExclusiveInclusivePriceTool.execute;
export default advaloremTaxExclusiveInclusivePriceTool;
