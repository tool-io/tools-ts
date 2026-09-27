import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leanSeasonPrice: number;
  readonly harvestPrice: number;
  readonly transportDifference: number;
};
export type Output = { readonly rawGap: number; readonly adjustedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leanSeasonPrice: { type: "number", minimum: 0 },
    harvestPrice: { type: "number", minimum: 0 },
    transportDifference: { type: "number" },
  },
  required: ["leanSeasonPrice", "harvestPrice", "transportDifference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rawGap: { type: "number" }, adjustedGap: { type: "number" } },
  required: ["rawGap", "adjustedGap"],
} as const;
/** Absolute price difference after an explicit signed transport-cost adjustment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leanSeasonPrice, harvestPrice, transportDifference } = request;
  const compute = (): Output => {
    H.domain(leanSeasonPrice >= 0 && harvestPrice >= 0);
    return {
      rawGap: leanSeasonPrice - harvestPrice,
      adjustedGap: leanSeasonPrice - harvestPrice - transportDifference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leanSeasonPrice: 15, harvestPrice: 10, transportDifference: 2 },
  output: { rawGap: 5, adjustedGap: 3 },
} satisfies ToolExample<Input, Output>;
export const foodSecuritySeasonalPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-security-seasonal-price-gap",
    title: "Food Security Seasonal Price Gap Tool",
    description:
      "Absolute price difference after an explicit signed transport-cost adjustment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leanSeasonPrice: { type: "number", minimum: 0 },
        harvestPrice: { type: "number", minimum: 0 },
        transportDifference: { type: "number" },
      },
      required: ["leanSeasonPrice", "harvestPrice", "transportDifference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawGap: { type: "number" },
        adjustedGap: { type: "number" },
      },
      required: ["rawGap", "adjustedGap"],
    },
    ports: {
      inputs: [
        {
          id: "leanSeasonPrice",
          label: "Lean Season Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "harvestPrice",
          label: "Harvest Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transportDifference",
          label: "Transport Difference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawGap", label: "Raw Gap", valueType: { type: "number" } },
        {
          id: "adjustedGap",
          label: "Adjusted Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSecuritySeasonalPriceGapTool.execute;
export default foodSecuritySeasonalPriceGapTool;
