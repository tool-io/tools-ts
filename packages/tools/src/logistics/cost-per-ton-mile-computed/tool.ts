import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CostPerTonMileComputedInput = {
  readonly milesHauled: number;
  readonly operatingCostUsd: number;
  readonly tonsHauled: number;
};

export type CostPerTonMileComputedOutput = {
  readonly costPerTonMileUsd: number;
  readonly tonMiles: number;
};

export const calculateCostPerTonMileComputed = (
  input: CostPerTonMileComputedInput,
): CostPerTonMileComputedOutput => {
  if (!Number.isFinite(input.tonsHauled) || input.tonsHauled <= 0)
    return simpleError(
      "tonsHauled",
      "Tons hauled must be finite and greater than zero.",
      "invalid_tons",
    );
  if (!Number.isFinite(input.milesHauled) || input.milesHauled <= 0)
    return simpleError(
      "milesHauled",
      "Miles hauled must be finite and greater than zero.",
      "invalid_miles",
    );
  if (!Number.isFinite(input.operatingCostUsd) || input.operatingCostUsd < 0)
    return simpleError(
      "operatingCostUsd",
      "Operating cost must be finite and non-negative.",
      "invalid_cost",
    );
  const tonMiles = input.tonsHauled * input.milesHauled;
  if (!Number.isFinite(tonMiles) || tonMiles <= 0)
    return simpleError(
      "milesHauled",
      "The ton-mile workload is outside the representable range.",
      "ton_miles_out_of_range",
    );
  const costPerTonMileUsd =
    input.operatingCostUsd === 0 ? 0 : input.operatingCostUsd / tonMiles;
  if (
    !Number.isFinite(costPerTonMileUsd) ||
    (input.operatingCostUsd > 0 && costPerTonMileUsd <= 0)
  )
    return simpleError(
      "operatingCostUsd",
      "Cost per ton-mile is outside the representable range.",
      "cost_out_of_range",
    );
  return { tonMiles, costPerTonMileUsd };
};

export const costPerTonMileComputedExample = {
  input: { milesHauled: 800, operatingCostUsd: 1440, tonsHauled: 16 },
  output: { costPerTonMileUsd: 0.1125, tonMiles: 12800 },
} satisfies ToolExample<
  CostPerTonMileComputedInput,
  CostPerTonMileComputedOutput
>;

export const costPerTonMileComputedTool = createSimpleTool({
  id: "logistics/cost-per-ton-mile-computed",
  title: "Cost Per Ton Mile Computed Calculator",
  description:
    "Compute operating cost per ton-mile from shipment cost, hauled tons, and loaded distance without converting between short tons and metric tonnes.",
  inputs: [
    {
      description: "Operating cost for the movement in USD.",
      id: "operatingCostUsd",
      kind: "number",
      label: "Operating cost",
      minimum: 0,
      unit: "USD",
    },
    {
      description:
        "Freight weight in the ton convention used for reporting; do not mix short tons and metric tonnes.",
      id: "tonsHauled",
      kind: "number",
      label: "Tons hauled",
      minimum: Number.MIN_VALUE,
      unit: "ton",
    },
    {
      description: "Loaded distance over which that freight moved.",
      id: "milesHauled",
      kind: "number",
      label: "Miles hauled",
      minimum: Number.MIN_VALUE,
      unit: "mi",
    },
  ],
  outputs: [
    {
      description: "Freight tons multiplied by loaded miles.",
      id: "tonMiles",
      kind: "number",
      label: "Ton-miles",
      minimum: Number.MIN_VALUE,
      unit: "ton·mi",
    },
    {
      description: "Operating cost divided by total ton-miles.",
      id: "costPerTonMileUsd",
      kind: "number",
      label: "Cost per ton-mile",
      minimum: 0,
      unit: "USD/(ton·mi)",
    },
  ],
  calculate: (input) =>
    calculateCostPerTonMileComputed({
      milesHauled: input.milesHauled as number,
      operatingCostUsd: input.operatingCostUsd as number,
      tonsHauled: input.tonsHauled as number,
    }),
});

export const runCostPerTonMileComputed = costPerTonMileComputedTool.execute;
export default costPerTonMileComputedTool;
