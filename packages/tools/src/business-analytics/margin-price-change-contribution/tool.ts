import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly priceChange: number;
  readonly incrementalUnitCost: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    priceChange: { type: "number" },
    incrementalUnitCost: { type: "number" },
  },
  required: ["quantity", "priceChange", "incrementalUnitCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate margin price change contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, priceChange, incrementalUnitCost } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    return { contribution: quantity * (priceChange - incrementalUnitCost) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 100, priceChange: 2, incrementalUnitCost: 0.5 },
  output: { contribution: 150 },
} satisfies ToolExample<Input, Output>;
export const marginPriceChangeContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/margin-price-change-contribution",
    title: "Margin Price Change Contribution Tool",
    description:
      "Calculate margin price change contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        priceChange: { type: "number" },
        incrementalUnitCost: { type: "number" },
      },
      required: ["quantity", "priceChange", "incrementalUnitCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceChange",
          label: "Price Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incrementalUnitCost",
          label: "Incremental Unit Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marginPriceChangeContributionTool.execute;
export default marginPriceChangeContributionTool;
