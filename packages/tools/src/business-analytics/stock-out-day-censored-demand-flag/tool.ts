import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockoutOccurred: boolean;
  readonly observedSales: number;
};
export type Output = {
  readonly demandCensored: boolean;
  readonly observedLowerBound: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockoutOccurred: { type: "boolean" },
    observedSales: { type: "integer", minimum: 0 },
  },
  required: ["stockoutOccurred", "observedSales"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demandCensored: { type: "boolean" },
    observedLowerBound: { type: "integer" },
  },
  required: ["demandCensored", "observedLowerBound"],
} as const;
/** Tag a sales count as a demand lower bound when an explicit stockout flag indicates censored demand; no lost demand is imputed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockoutOccurred, observedSales } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(observedSales) &&
        observedSales >= 0 &&
        observedSales <= Number.MAX_SAFE_INTEGER,
      "observedSales",
    ),
      observedSales);
    return {
      demandCensored: stockoutOccurred,
      observedLowerBound: observedSales,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stockoutOccurred: true, observedSales: 12 },
  output: { demandCensored: true, observedLowerBound: 12 },
} satisfies ToolExample<Input, Output>;
export const stockOutDayCensoredDemandFlagTool = H.defineSchemaCalculation<
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
    id: "business-analytics/stock-out-day-censored-demand-flag",
    title: "Stock Out Day Censored Demand Flag",
    description:
      "Tag a sales count as a demand lower bound when an explicit stockout flag indicates censored demand; no lost demand is imputed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockoutOccurred: { type: "boolean" },
        observedSales: { type: "integer", minimum: 0 },
      },
      required: ["stockoutOccurred", "observedSales"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demandCensored: { type: "boolean" },
        observedLowerBound: { type: "integer" },
      },
      required: ["demandCensored", "observedLowerBound"],
    },
    ports: {
      inputs: [
        {
          id: "stockoutOccurred",
          label: "Stockout Occurred",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "observedSales",
          label: "Observed Sales",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "demandCensored",
          label: "Demand Censored",
          valueType: { type: "boolean" },
        },
        {
          id: "observedLowerBound",
          label: "Observed Lower Bound",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = stockOutDayCensoredDemandFlagTool.execute;
export default stockOutDayCensoredDemandFlagTool;
