import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReeferVsDryVanRateDeltaLookupInput = {
  readonly dryVanRatePerMileUsd: number;
  readonly reeferRatePerMileUsd: number;
};

export type ReeferVsDryVanRateDeltaLookupOutput = {
  readonly premiumPercentOverDryVan: number;
  readonly premiumPerMileUsd: number;
};

export const calculateReeferVsDryVanRateDeltaLookup = (
  input: ReeferVsDryVanRateDeltaLookupInput,
): ReeferVsDryVanRateDeltaLookupOutput => {
  if (
    !Number.isFinite(input.dryVanRatePerMileUsd) ||
    input.dryVanRatePerMileUsd <= 0
  )
    return simpleError(
      "dryVanRatePerMileUsd",
      "The dry van rate must be greater than zero.",
      "invalid_rate",
    );
  if (
    !Number.isFinite(input.reeferRatePerMileUsd) ||
    input.reeferRatePerMileUsd < 0
  )
    return simpleError(
      "reeferRatePerMileUsd",
      "The reefer rate must be finite and non-negative.",
      "invalid_rate",
    );
  const premiumPerMileUsd =
    input.reeferRatePerMileUsd - input.dryVanRatePerMileUsd;
  const premiumPercentOverDryVan =
    (premiumPerMileUsd / input.dryVanRatePerMileUsd) * 100;
  if (
    !Number.isFinite(premiumPerMileUsd) ||
    !Number.isFinite(premiumPercentOverDryVan)
  )
    return simpleError(
      "reeferRatePerMileUsd",
      "The rate comparison is outside the representable range.",
      "result_out_of_range",
    );
  return {
    premiumPerMileUsd,
    premiumPercentOverDryVan,
  };
};

export const reeferVsDryVanRateDeltaLookupExample = {
  input: { dryVanRatePerMileUsd: 2.4, reeferRatePerMileUsd: 2.85 },
  output: {
    premiumPercentOverDryVan: 18.750000000000007,
    premiumPerMileUsd: 0.4500000000000002,
  },
} satisfies ToolExample<
  ReeferVsDryVanRateDeltaLookupInput,
  ReeferVsDryVanRateDeltaLookupOutput
>;

export const reeferVsDryVanRateDeltaLookupTool = createSimpleTool({
  id: "logistics/reefer-vs-dry-van-rate-delta-lookup",
  title: "Reefer vs Dry Van Rate Delta Lookup",
  description:
    "Compare a refrigerated rate against a dry van benchmark as dollars and percent per mile.",
  inputs: [
    {
      description: "Dry van benchmark rate in USD per mile.",
      id: "dryVanRatePerMileUsd",
      kind: "number",
      label: "Dry van rate",
      minimum: Number.MIN_VALUE,
      unit: "USD/mi",
    },
    {
      description: "Reefer (refrigerated) rate in USD per mile.",
      id: "reeferRatePerMileUsd",
      kind: "number",
      label: "Reefer rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Reefer premium over dry van in USD per mile.",
      id: "premiumPerMileUsd",
      kind: "number",
      label: "Premium $/mile",
    },
    {
      description: "Reefer premium as a percent of the dry van rate.",
      id: "premiumPercentOverDryVan",
      kind: "number",
      label: "Premium %",
    },
  ],
  calculate: (input) =>
    calculateReeferVsDryVanRateDeltaLookup({
      dryVanRatePerMileUsd: input.dryVanRatePerMileUsd as number,
      reeferRatePerMileUsd: input.reeferRatePerMileUsd as number,
    }),
});

export const runReeferVsDryVanRateDeltaLookup =
  reeferVsDryVanRateDeltaLookupTool.execute;
export default reeferVsDryVanRateDeltaLookupTool;
