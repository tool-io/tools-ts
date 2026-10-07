import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockUnits: number;
  readonly averageDailyDemand: number;
};
export type Output = { readonly coverDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockUnits: { type: "number", minimum: 0 },
    averageDailyDemand: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["stockUnits", "averageDailyDemand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coverDays: { type: "number" } },
  required: ["coverDays"],
} as const;
/** Divide supplied SKU stock by positive average daily demand for constant-rate cover days without forecasting demand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockUnits, averageDailyDemand } = request;
  const compute = (): Output => {
    H.domain(stockUnits >= 0, "stockUnits");
    (H.domain(
      Number.isFinite(averageDailyDemand) && averageDailyDemand > 0,
      "averageDailyDemand",
    ),
      averageDailyDemand);
    return { coverDays: stockUnits / averageDailyDemand };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stockUnits: 120, averageDailyDemand: 15 },
  output: { coverDays: 8 },
} satisfies ToolExample<Input, Output>;
export const merchandiseStockCoverSkuTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-analytics",
        "business analytics",
        "business and finance",
      ],
      keywords: ["business analytics", "business and finance"],
    },
    id: "business-analytics/merchandise-stock-cover-sku",
    title: "Merchandise Stock Cover SKU",
    description:
      "Divide supplied SKU stock by positive average daily demand for constant-rate cover days without forecasting demand.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockUnits: { type: "number", minimum: 0 },
        averageDailyDemand: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["stockUnits", "averageDailyDemand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coverDays: { type: "number" } },
      required: ["coverDays"],
    },
    ports: {
      inputs: [
        {
          id: "stockUnits",
          label: "Stock Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "averageDailyDemand",
          label: "Average Daily Demand",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "coverDays", label: "Cover Days", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = merchandiseStockCoverSkuTool.execute;
export default merchandiseStockCoverSkuTool;
