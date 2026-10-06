import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly salesRevenue: number;
  readonly goodsCost: number;
  readonly stallFee: number;
  readonly otherDailyCost: number;
};
export type Output = { readonly dailyMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    salesRevenue: { type: "number", minimum: 0 },
    goodsCost: { type: "number", minimum: 0 },
    stallFee: { type: "number", minimum: 0 },
    otherDailyCost: { type: "number", minimum: 0 },
  },
  required: ["salesRevenue", "goodsCost", "stallFee", "otherDailyCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dailyMargin: { type: "number" } },
  required: ["dailyMargin"],
} as const;
/** Subtract explicitly nonoverlapping goods, stall and other daily costs from a market-day sales record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { salesRevenue, goodsCost, stallFee, otherDailyCost } = request;
  const compute = (): Output => {
    H.domain(
      salesRevenue >= 0 &&
        goodsCost >= 0 &&
        stallFee >= 0 &&
        otherDailyCost >= 0,
      "salesRevenue",
    );
    return {
      dailyMargin: salesRevenue - goodsCost - stallFee - otherDailyCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    salesRevenue: 500,
    goodsCost: 250,
    stallFee: 40,
    otherDailyCost: 30,
  },
  output: { dailyMargin: 180 },
} satisfies ToolExample<Input, Output>;
export const marketStallDayMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/market-stall-day-margin",
    title: "Market Stall Day Margin",
    description:
      "Subtract explicitly nonoverlapping goods, stall and other daily costs from a market-day sales record.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        salesRevenue: { type: "number", minimum: 0 },
        goodsCost: { type: "number", minimum: 0 },
        stallFee: { type: "number", minimum: 0 },
        otherDailyCost: { type: "number", minimum: 0 },
      },
      required: ["salesRevenue", "goodsCost", "stallFee", "otherDailyCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dailyMargin: { type: "number" } },
      required: ["dailyMargin"],
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
          id: "goodsCost",
          label: "Goods Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stallFee",
          label: "Stall Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherDailyCost",
          label: "Other Daily Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dailyMargin",
          label: "Daily Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = marketStallDayMarginTool.execute;
export default marketStallDayMarginTool;
