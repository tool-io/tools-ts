import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuhlmannStraubCredibilityInput = {
  readonly exposureUnits: number;
  readonly processVariance: number;
  readonly varianceOfHypotheticalMeans: number;
};

export type BuhlmannStraubCredibilityOutput = {
  readonly credibilityFactor: number;
};

export const buhlmannStraubCredibilityExample = {
  input: {
    exposureUnits: 1000,
    processVariance: 50,
    varianceOfHypotheticalMeans: 2,
  },
  output: {
    credibilityFactor: 0.975609756097561,
  },
} satisfies ToolExample<
  BuhlmannStraubCredibilityInput,
  BuhlmannStraubCredibilityOutput
>;

export const calculateBuhlmannStraubCredibility = (
  input: BuhlmannStraubCredibilityInput,
): BuhlmannStraubCredibilityOutput => {
  if (input.exposureUnits < 0)
    simpleError(
      "exposureUnits",
      "Exposure units cannot be negative.",
      "invalid_exposure",
    );
  if (input.processVariance < 0)
    simpleError(
      "processVariance",
      "Process variance cannot be negative.",
      "invalid_variance",
    );
  if (input.varianceOfHypotheticalMeans <= 0)
    simpleError(
      "varianceOfHypotheticalMeans",
      "The variance of hypothetical means must be positive.",
      "invalid_value",
    );
  if (input.exposureUnits === 0) return { credibilityFactor: 0 };
  const k = input.processVariance / input.varianceOfHypotheticalMeans;
  return {
    credibilityFactor: input.exposureUnits / (input.exposureUnits + k),
  };
};

export const buhlmannStraubCredibilityTool = createSimpleTool({
  calculate: (input) =>
    calculateBuhlmannStraubCredibility({
      exposureUnits: input.exposureUnits as number,
      processVariance: input.processVariance as number,
      varianceOfHypotheticalMeans: input.varianceOfHypotheticalMeans as number,
    }),
  description:
    "Weight experience against the prior mean using the Buhlmann-Straub credibility factor from total exposure and the variance components.",
  id: "actuarial/buhlmann-straub-credibility",
  inputs: [
    {
      description: "Total exposure weight of the experience data.",
      id: "exposureUnits",
      kind: "number",
      label: "Exposure units",
      minimum: 0,
    },
    {
      description:
        "Expected variance of observations around their risk's own mean.",
      id: "processVariance",
      kind: "number",
      label: "Process variance",
      minimum: 0,
    },
    {
      description: "Variance of the means across risks.",
      id: "varianceOfHypotheticalMeans",
      kind: "number",
      label: "Variance of hypothetical means",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Weight applied to the observed experience.",
      id: "credibilityFactor",
      kind: "number",
      label: "Credibility factor",
    },
  ],
  title: "Buhlmann-Straub Credibility Factor Calculator",
});
export const runBuhlmannStraubCredibility =
  buhlmannStraubCredibilityTool.execute;
export default buhlmannStraubCredibilityTool;
