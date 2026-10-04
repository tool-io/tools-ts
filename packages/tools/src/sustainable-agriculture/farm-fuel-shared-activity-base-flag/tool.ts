import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFuel: number;
  readonly sharedFuel: number;
  readonly activityFraction: number;
  readonly includeShared: boolean;
};
export type Output = { readonly allocatedFuel: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFuel: { type: "number", minimum: 0 },
    sharedFuel: { type: "number", minimum: 0 },
    activityFraction: { type: "number", minimum: 0, maximum: 1 },
    includeShared: { type: "boolean" },
  },
  required: ["totalFuel", "sharedFuel", "activityFraction", "includeShared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocatedFuel: { type: "number" } },
  required: ["allocatedFuel"],
} as const;
/** Allocate supplied fuel under explicit shared-activity and allocation assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFuel, sharedFuel, activityFraction, includeShared } = request;
  const compute = (): Output => {
    H.probability(activityFraction);
    H.domain(totalFuel >= 0 && sharedFuel >= 0 && sharedFuel <= totalFuel);
    return {
      allocatedFuel:
        (totalFuel - (includeShared ? 0 : sharedFuel)) * activityFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalFuel: 100,
    sharedFuel: 20,
    activityFraction: 0.5,
    includeShared: true,
  },
  output: { allocatedFuel: 50 },
} satisfies ToolExample<Input, Output>;
export const farmFuelSharedActivityBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-fuel-shared-activity-base-flag",
    title: "Farm Fuel Shared Activity Base Flag Tool",
    description:
      "Allocate supplied fuel under explicit shared-activity and allocation assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFuel: { type: "number", minimum: 0 },
        sharedFuel: { type: "number", minimum: 0 },
        activityFraction: { type: "number", minimum: 0, maximum: 1 },
        includeShared: { type: "boolean" },
      },
      required: [
        "totalFuel",
        "sharedFuel",
        "activityFraction",
        "includeShared",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allocatedFuel: { type: "number" } },
      required: ["allocatedFuel"],
    },
    ports: {
      inputs: [
        {
          id: "totalFuel",
          label: "Total Fuel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedFuel",
          label: "Shared Fuel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activityFraction",
          label: "Activity Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeShared",
          label: "Include Shared",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "allocatedFuel",
          label: "Allocated Fuel",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmFuelSharedActivityBaseFlagTool.execute;
export default farmFuelSharedActivityBaseFlagTool;
