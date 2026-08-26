import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AgeStandardizedPrevalenceWeightedInput = {
  readonly prevalenceByAge: readonly number[];
  readonly standardWeights: readonly number[];
};

export type AgeStandardizedPrevalenceWeightedOutput = {
  readonly weightedPrevalence: number;
  readonly weightedPrevalencePercent: number;
};

export const calculateAgeStandardizedPrevalenceWeighted = (
  input: AgeStandardizedPrevalenceWeightedInput,
): AgeStandardizedPrevalenceWeightedOutput => {
  if (input.prevalenceByAge.length === 0)
    simpleError(
      "prevalenceByAge",
      "Provide at least one age-specific prevalence.",
      "invalid_list",
    );
  let weightTotal = 0;
  for (const weight of input.standardWeights) {
    if (!(typeof weight === "number" && Number.isFinite(weight) && weight >= 0))
      simpleError(
        "standardWeights",
        "Standard weights must be finite and non-negative.",
        "invalid_list",
      );
    weightTotal += weight;
  }
  if (input.standardWeights.length !== input.prevalenceByAge.length)
    simpleError(
      "standardWeights",
      "Standard weights must match the prevalence values one to one.",
      "invalid_list",
    );
  if (!(weightTotal > 0))
    simpleError(
      "standardWeights",
      "The standard weights must sum to a positive total.",
      "invalid_list",
    );
  let weightedSum = 0;
  for (let i = 0; i < input.prevalenceByAge.length; i += 1) {
    const prevalence = input.prevalenceByAge[i]!;
    if (!(
      typeof prevalence === "number" &&
      Number.isFinite(prevalence) &&
      prevalence >= 0 &&
      prevalence <= 1
    ))
      simpleError(
        "prevalenceByAge",
        "Age-specific prevalences must lie between zero and one.",
        "invalid_list",
      );
    weightedSum += prevalence * input.standardWeights[i]!;
  }
  return {
    weightedPrevalence: weightedSum / weightTotal,
    weightedPrevalencePercent: (weightedSum / weightTotal) * 100,
  };
};

export const ageStandardizedPrevalenceWeightedExample = {
  input: { prevalenceByAge: [0.02, 0.08], standardWeights: [700, 300] },
  output: {
    weightedPrevalence: 0.038,
    weightedPrevalencePercent: 3.8,
  },
} satisfies ToolExample<
  AgeStandardizedPrevalenceWeightedInput,
  AgeStandardizedPrevalenceWeightedOutput
>;

export const ageStandardizedPrevalenceWeightedTool = createSimpleTool({
  id: "demography/age-standardized-prevalence-weighted",
  title: "Age Standardized Prevalence Weighted",
  description:
    "Compute the age-standardized prevalence as the standard-weight weighted average of age-specific prevalences, sum(w_i * p_i) / sum(w_i).",
  inputs: [
    {
      description: "Age-specific prevalences as proportions from zero to one.",
      id: "prevalenceByAge",
      kind: "numberList",
      label: "Prevalences",
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
      description: "Weighted standardized prevalence as a proportion.",
      id: "weightedPrevalence",
      kind: "number",
      label: "Prevalence",
    },
    {
      description: "Weighted standardized prevalence in percent.",
      id: "weightedPrevalencePercent",
      kind: "number",
      label: "Prevalence %",
    },
  ],
  calculate: (input) =>
    calculateAgeStandardizedPrevalenceWeighted(
      input as unknown as AgeStandardizedPrevalenceWeightedInput,
    ),
});

export const runAgeStandardizedPrevalenceWeighted =
  ageStandardizedPrevalenceWeightedTool.execute;
export default ageStandardizedPrevalenceWeightedTool;
