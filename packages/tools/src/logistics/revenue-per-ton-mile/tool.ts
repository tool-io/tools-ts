import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RevenuePerTonMileInput = {
  readonly milesHauled: number;
  readonly revenueUsd: number;
  readonly tonsHauled: number;
};

export type RevenuePerTonMileOutput = {
  readonly revenuePerTonMileUsd: number;
  readonly tonMiles: number;
};

export const calculateRevenuePerTonMile = (
  input: RevenuePerTonMileInput,
): RevenuePerTonMileOutput => {
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
  if (!Number.isFinite(input.revenueUsd) || input.revenueUsd < 0)
    return simpleError(
      "revenueUsd",
      "Revenue must be finite and non-negative.",
      "invalid_revenue",
    );
  const tonMiles = input.tonsHauled * input.milesHauled;
  if (!Number.isFinite(tonMiles) || tonMiles <= 0)
    return simpleError(
      "milesHauled",
      "The ton-mile workload is outside the representable range.",
      "ton_miles_out_of_range",
    );
  const revenuePerTonMileUsd =
    input.revenueUsd === 0 ? 0 : input.revenueUsd / tonMiles;
  if (
    !Number.isFinite(revenuePerTonMileUsd) ||
    (input.revenueUsd > 0 && revenuePerTonMileUsd <= 0)
  )
    return simpleError(
      "revenueUsd",
      "Revenue per ton-mile is outside the representable range.",
      "revenue_out_of_range",
    );
  return { tonMiles, revenuePerTonMileUsd };
};

export const revenuePerTonMileExample = {
  input: { milesHauled: 900, revenueUsd: 1800, tonsHauled: 20 },
  output: { revenuePerTonMileUsd: 0.1, tonMiles: 18000 },
} satisfies ToolExample<RevenuePerTonMileInput, RevenuePerTonMileOutput>;

export const revenuePerTonMileTool = createSimpleTool({
  id: "logistics/revenue-per-ton-mile",
  title: "Revenue Per Ton Mile Calculator",
  description:
    "Compute freight revenue per ton-mile from shipment revenue, hauled tons, and loaded distance without converting between short tons and metric tonnes.",
  inputs: [
    {
      description: "Freight revenue earned for the movement.",
      id: "revenueUsd",
      kind: "number",
      label: "Revenue",
      minimum: 0,
      unit: "USD",
    },
    {
      description:
        "Freight weight in the ton convention used for reporting; do not mix short tons and metric tonnes.",
      id: "tonsHauled",
      kind: "number",
      label: "Tons",
      minimum: Number.MIN_VALUE,
      unit: "ton",
    },
    {
      description: "Loaded distance over which the freight moved.",
      id: "milesHauled",
      kind: "number",
      label: "Miles",
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
      description: "Revenue divided by total ton-miles.",
      id: "revenuePerTonMileUsd",
      kind: "number",
      label: "Revenue/ton-mile",
      minimum: 0,
      unit: "USD/(ton·mi)",
    },
  ],
  calculate: (input) =>
    calculateRevenuePerTonMile({
      milesHauled: input.milesHauled as number,
      revenueUsd: input.revenueUsd as number,
      tonsHauled: input.tonsHauled as number,
    }),
});

export const runRevenuePerTonMile = revenuePerTonMileTool.execute;
export default revenuePerTonMileTool;
