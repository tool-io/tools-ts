import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly salesRevenue: number;
  readonly openingGrossProfit: number;
  readonly writeoffCost: number;
};
export type Output = {
  readonly adjustedGrossProfit: number;
  readonly marginFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salesRevenue: { type: "number", exclusiveMinimum: 0 },
    openingGrossProfit: { type: "number" },
    writeoffCost: { type: "number", minimum: 0 },
  },
  required: ["salesRevenue", "openingGrossProfit", "writeoffCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedGrossProfit: { type: "number" },
    marginFraction: { type: "number" },
  },
  required: ["adjustedGrossProfit", "marginFraction"],
} as const;
/** Subtract an explicit inventory write-off from supplied gross profit and divide by positive sales revenue. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { salesRevenue, openingGrossProfit, writeoffCost } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(salesRevenue) && salesRevenue > 0,
      "salesRevenue",
    ),
      salesRevenue);
    H.domain(writeoffCost >= 0, "writeoffCost");
    return {
      adjustedGrossProfit: openingGrossProfit - writeoffCost,
      marginFraction: (openingGrossProfit - writeoffCost) / salesRevenue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { salesRevenue: 1000, openingGrossProfit: 400, writeoffCost: 50 },
  output: { adjustedGrossProfit: 350, marginFraction: 0.35 },
} satisfies ToolExample<Input, Output>;
export const inventoryWriteoffMarginImpactTool = H.defineSchemaCalculation<
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
    id: "business-analytics/inventory-write-off-margin-impact",
    title: "Inventory Write Off Margin Impact",
    description:
      "Subtract an explicit inventory write-off from supplied gross profit and divide by positive sales revenue.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        salesRevenue: { type: "number", exclusiveMinimum: 0 },
        openingGrossProfit: { type: "number" },
        writeoffCost: { type: "number", minimum: 0 },
      },
      required: ["salesRevenue", "openingGrossProfit", "writeoffCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustedGrossProfit: { type: "number" },
        marginFraction: { type: "number" },
      },
      required: ["adjustedGrossProfit", "marginFraction"],
    },
    ports: {
      inputs: [
        {
          id: "salesRevenue",
          label: "Sales Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingGrossProfit",
          label: "Opening Gross Profit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "writeoffCost",
          label: "Writeoff Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedGrossProfit",
          label: "Adjusted Gross Profit",
          valueType: { type: "number" },
        },
        {
          id: "marginFraction",
          label: "Margin Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inventoryWriteoffMarginImpactTool.execute;
export default inventoryWriteoffMarginImpactTool;
