import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpotVsContractRateMixBlendInput = {
  readonly contractRatePerMileUsd: number;
  readonly contractSharePercent?: number;
  readonly spotRatePerMileUsd: number;
};

export type SpotVsContractRateMixBlendOutput = {
  readonly blendedRatePerMileUsd: number;
  readonly spotSharePercent: number;
};

export const calculateSpotVsContractRateMixBlend = (
  input: SpotVsContractRateMixBlendInput,
): SpotVsContractRateMixBlendOutput => {
  const contractSharePercent = input.contractSharePercent ?? 70;
  if (
    !Number.isFinite(contractSharePercent) ||
    contractSharePercent < 0 ||
    contractSharePercent > 100
  )
    return simpleError(
      "contractSharePercent",
      "Contract share must be between zero and one hundred.",
      "invalid_share",
    );
  if (
    !Number.isFinite(input.contractRatePerMileUsd) ||
    input.contractRatePerMileUsd <= 0
  )
    return simpleError(
      "contractRatePerMileUsd",
      "The contract rate must be greater than zero.",
      "invalid_rate",
    );
  if (
    !Number.isFinite(input.spotRatePerMileUsd) ||
    input.spotRatePerMileUsd <= 0
  )
    return simpleError(
      "spotRatePerMileUsd",
      "The spot rate must be greater than zero.",
      "invalid_rate",
    );
  const spotSharePercent = 100 - contractSharePercent;
  const contractWeight = contractSharePercent / 100;
  const blendedRatePerMileUsd =
    input.contractRatePerMileUsd * contractWeight +
    input.spotRatePerMileUsd * (1 - contractWeight);
  if (!Number.isFinite(blendedRatePerMileUsd) || blendedRatePerMileUsd <= 0)
    return simpleError(
      "contractRatePerMileUsd",
      "The blended rate is outside the representable range.",
      "rate_out_of_range",
    );
  return {
    spotSharePercent,
    blendedRatePerMileUsd,
  };
};

export const spotVsContractRateMixBlendExample = {
  input: {
    contractRatePerMileUsd: 2.1,
    contractSharePercent: 70,
    spotRatePerMileUsd: 2.75,
  },
  output: { blendedRatePerMileUsd: 2.295, spotSharePercent: 30 },
} satisfies ToolExample<
  SpotVsContractRateMixBlendInput,
  SpotVsContractRateMixBlendOutput
>;

export const spotVsContractRateMixBlendTool = createSimpleTool({
  id: "logistics/spot-vs-contract-rate-mix-blend",
  title: "Spot vs Contract Rate Mix Blend Calculator",
  description:
    "Blend contract and spot linehaul rates into one weighted average per mile for a chosen mix share.",
  inputs: [
    {
      description: "Committed contract rate in USD per mile.",
      id: "contractRatePerMileUsd",
      kind: "number",
      label: "Contract rate",
      minimum: Number.MIN_VALUE,
      unit: "USD/mi",
    },
    {
      default: 70,
      description: "Percent of miles covered by the contract commitment.",
      id: "contractSharePercent",
      kind: "number",
      label: "Contract share %",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Spot market rate in USD per mile.",
      id: "spotRatePerMileUsd",
      kind: "number",
      label: "Spot rate",
      minimum: Number.MIN_VALUE,
      unit: "USD/mi",
    },
  ],
  outputs: [
    {
      description: "Weighted average rate in USD per mile.",
      id: "blendedRatePerMileUsd",
      kind: "number",
      label: "Blended rate",
      minimum: Number.MIN_VALUE,
      unit: "USD/mi",
    },
    {
      description: "Remaining share of miles on the spot market.",
      id: "spotSharePercent",
      kind: "number",
      label: "Spot share %",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateSpotVsContractRateMixBlend({
      contractRatePerMileUsd: input.contractRatePerMileUsd as number,
      contractSharePercent: input.contractSharePercent as number | undefined,
      spotRatePerMileUsd: input.spotRatePerMileUsd as number,
    }),
});

export const runSpotVsContractRateMixBlend =
  spotVsContractRateMixBlendTool.execute;
export default spotVsContractRateMixBlendTool;
