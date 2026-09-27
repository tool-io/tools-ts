import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly foodCost: number;
  readonly roundTripFare: number;
  readonly otherAccessCost: number;
};
export type Output = {
  readonly totalOutlay: number;
  readonly accessShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foodCost: { type: "number", minimum: 0 },
    roundTripFare: { type: "number", minimum: 0 },
    otherAccessCost: { type: "number", minimum: 0 },
  },
  required: ["foodCost", "roundTripFare", "otherAccessCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalOutlay: { type: "number" },
    accessShare: { type: "number" },
  },
  required: ["totalOutlay", "accessShare"],
} as const;
/** Calculate food access market travel cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { foodCost, roundTripFare, otherAccessCost } = request;
  const compute = (): Output => {
    H.domain(
      foodCost >= 0 &&
        roundTripFare >= 0 &&
        otherAccessCost >= 0 &&
        foodCost + roundTripFare + otherAccessCost > 0,
    );
    return {
      totalOutlay: foodCost + roundTripFare + otherAccessCost,
      accessShare:
        (roundTripFare + otherAccessCost) /
        (foodCost + roundTripFare + otherAccessCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { foodCost: 80, roundTripFare: 15, otherAccessCost: 5 },
  output: { totalOutlay: 100, accessShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const foodAccessMarketTravelCostShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-access-market-travel-cost-share",
    title: "Food Access Market Travel Cost Share Tool",
    description:
      "Calculate food access market travel cost share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foodCost: { type: "number", minimum: 0 },
        roundTripFare: { type: "number", minimum: 0 },
        otherAccessCost: { type: "number", minimum: 0 },
      },
      required: ["foodCost", "roundTripFare", "otherAccessCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalOutlay: { type: "number" },
        accessShare: { type: "number" },
      },
      required: ["totalOutlay", "accessShare"],
    },
    ports: {
      inputs: [
        {
          id: "foodCost",
          label: "Food Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundTripFare",
          label: "Round Trip Fare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherAccessCost",
          label: "Other Access Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalOutlay",
          label: "Total Outlay",
          valueType: { type: "number" },
        },
        {
          id: "accessShare",
          label: "Access Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodAccessMarketTravelCostShareTool.execute;
export default foodAccessMarketTravelCostShareTool;
