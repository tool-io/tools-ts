import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yields: readonly number[];
  readonly prices: readonly number[];
  readonly area: number;
};
export type Output = {
  readonly grossValue: number;
  readonly valuePerArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yields: { type: "array", maxItems: 256, items: { type: "number" } },
    prices: { type: "array", maxItems: 256, items: { type: "number" } },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["yields", "prices", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossValue: { type: "number" },
    valuePerArea: { type: "number" },
  },
  required: ["grossValue", "valuePerArea"],
} as const;
/** Calculate polyculture price weighted yield term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yields, prices, area } = request;
  const compute = (): Output => {
    H.sameLength(yields, prices);
    H.domain(yields.every((x) => x >= 0) && prices.every((x) => x >= 0));
    H.positive(area);
    return {
      grossValue: H.dot(yields, prices),
      valuePerArea: H.dot(yields, prices) / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yields: [3, 4], prices: [10, 5], area: 2 },
  output: { grossValue: 50, valuePerArea: 25 },
} satisfies ToolExample<Input, Output>;
export const polyculturePriceWeightedYieldTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/polyculture-price-weighted-yield-term",
    title: "Polyculture Price Weighted Yield Term Tool",
    description:
      "Calculate polyculture price weighted yield term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yields: { type: "array", maxItems: 256, items: { type: "number" } },
        prices: { type: "array", maxItems: 256, items: { type: "number" } },
        area: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["yields", "prices", "area"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossValue: { type: "number" },
        valuePerArea: { type: "number" },
      },
      required: ["grossValue", "valuePerArea"],
    },
    ports: {
      inputs: [
        {
          id: "yields",
          label: "Yields",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "prices",
          label: "Prices",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossValue",
          label: "Gross Value",
          valueType: { type: "number" },
        },
        {
          id: "valuePerArea",
          label: "Value Per Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = polyculturePriceWeightedYieldTermTool.execute;
export default polyculturePriceWeightedYieldTermTool;
