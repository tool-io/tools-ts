import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly valueAtBasePrices: number;
  readonly totalBaseValue: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valueAtBasePrices: { type: "number", minimum: 0 },
    totalBaseValue: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["valueAtBasePrices", "totalBaseValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate trade weight price base share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { valueAtBasePrices, totalBaseValue } = request;
  const compute = (): Output => {
    H.positive(totalBaseValue);
    H.domain(valueAtBasePrices >= 0 && valueAtBasePrices <= totalBaseValue);
    return { share: valueAtBasePrices / totalBaseValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { valueAtBasePrices: 20, totalBaseValue: 100 },
  output: { share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const tradeWeightPriceBaseShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/trade-weight-price-base-share",
    title: "Trade Weight Price Base Share Tool",
    description:
      "Calculate trade weight price base share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valueAtBasePrices: { type: "number", minimum: 0 },
        totalBaseValue: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["valueAtBasePrices", "totalBaseValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "valueAtBasePrices",
          label: "Value At Base Prices",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalBaseValue",
          label: "Total Base Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = tradeWeightPriceBaseShareTool.execute;
export default tradeWeightPriceBaseShareTool;
