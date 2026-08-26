import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DirectStandardizedRateSdrInput = {
  readonly ageSpecificRates: readonly number[];
  readonly standardWeights: readonly number[];
};

export type DirectStandardizedRateSdrOutput = {
  readonly standardizedRate: number;
  readonly weightTotal: number;
};

export const calculateDirectStandardizedRateSdr = (
  input: DirectStandardizedRateSdrInput,
): DirectStandardizedRateSdrOutput => {
  if (input.ageSpecificRates.length === 0)
    simpleError(
      "ageSpecificRates",
      "Provide at least one age-specific rate.",
      "invalid_list",
    );
  for (const rate of input.ageSpecificRates)
    if (!(typeof rate === "number" && Number.isFinite(rate) && rate >= 0))
      simpleError(
        "ageSpecificRates",
        "Age-specific rates must be finite and non-negative.",
        "invalid_list",
      );
  if (input.standardWeights.length !== input.ageSpecificRates.length)
    simpleError(
      "standardWeights",
      "Weights must match the age-specific rates one to one.",
      "invalid_list",
    );
  let weightTotal = 0;
  let weightedSum = 0;
  for (let i = 0; i < input.ageSpecificRates.length; i += 1) {
    const weight = input.standardWeights[i]!;
    if (!(typeof weight === "number" && Number.isFinite(weight) && weight >= 0))
      simpleError(
        "standardWeights",
        "Standard weights must be finite and non-negative.",
        "invalid_list",
      );
    weightedSum += input.ageSpecificRates[i]! * weight;
    weightTotal += weight;
  }
  if (!(weightTotal > 0))
    simpleError(
      "standardWeights",
      "The standard weights must sum to a positive total.",
      "invalid_list",
    );
  return { standardizedRate: weightedSum / weightTotal, weightTotal };
};

export const directStandardizedRateSdrExample = {
  input: { ageSpecificRates: [0.01, 0.05], standardWeights: [600, 400] },
  output: { standardizedRate: 0.026, weightTotal: 1000 },
} satisfies ToolExample<
  DirectStandardizedRateSdrInput,
  DirectStandardizedRateSdrOutput
>;

export const directStandardizedRateSdrTool = createSimpleTool({
  id: "demography/direct-standardized-rate-sdr",
  title: "Direct Standardized Rate SDR",
  description:
    "Compute the directly age-standardized rate as the standard-population-weighted average of age-specific rates, SDR = sum(m_i * W_i) / sum(W_i).",
  inputs: [
    {
      description:
        "Age-specific rates in the study population, in any consistent unit per person-year.",
      id: "ageSpecificRates",
      kind: "numberList",
      label: "Age rates",
    },
    {
      description:
        "Reference standard weights or counts for the same age groups.",
      id: "standardWeights",
      kind: "numberList",
      label: "Standard weights",
    },
  ],
  outputs: [
    {
      description:
        "Directly standardized rate in the units of the supplied rates.",
      id: "standardizedRate",
      kind: "number",
      label: "SDR",
    },
    {
      description: "Sum of the standard weights used.",
      id: "weightTotal",
      kind: "number",
      label: "Weight total",
    },
  ],
  calculate: (input) =>
    calculateDirectStandardizedRateSdr(
      input as unknown as DirectStandardizedRateSdrInput,
    ),
});

export const runDirectStandardizedRateSdr =
  directStandardizedRateSdrTool.execute;
export default directStandardizedRateSdrTool;
