import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KeyfitzMomentumFactorInput = {
  readonly birthRateB: number;
  readonly lifeExpectancy0: number;
  readonly growthRateR: number;
  readonly meanAgeChildbearing: number;
};

export type KeyfitzMomentumFactorOutput = {
  readonly momentumFactor: number;
};

export const calculateKeyfitzMomentumFactor = (
  input: KeyfitzMomentumFactorInput,
): KeyfitzMomentumFactorOutput => {
  if (!(input.birthRateB > 0))
    simpleError(
      "birthRateB",
      "The birth rate must be greater than zero.",
      "invalid_rate",
    );
  if (!(input.lifeExpectancy0 > 0))
    simpleError(
      "lifeExpectancy0",
      "Life expectancy at birth must be positive.",
      "invalid_expectancy",
    );
  if (!(input.meanAgeChildbearing > 0))
    simpleError(
      "meanAgeChildbearing",
      "The mean age of childbearing must be greater than zero.",
      "invalid_age",
    );
  const scaledAge = input.growthRateR * input.meanAgeChildbearing;
  if (Math.abs(scaledAge) < 1e-12)
    return { momentumFactor: input.birthRateB * input.lifeExpectancy0 };
  return {
    momentumFactor:
      (input.birthRateB * input.lifeExpectancy0 * (1 - Math.exp(-scaledAge))) /
      scaledAge,
  };
};

export const keyfitzMomentumFactorExample = {
  input: {
    birthRateB: 0.035,
    lifeExpectancy0: 65,
    growthRateR: 0.025,
    meanAgeChildbearing: 27,
  },
  output: { momentumFactor: 1.654324656470853 },
} satisfies ToolExample<
  KeyfitzMomentumFactorInput,
  KeyfitzMomentumFactorOutput
>;

export const keyfitzMomentumFactorTool = createSimpleTool({
  id: "demography/keyfitz-momentum-factor",
  title: "Keyfitz Momentum Factor Calculator",
  description:
    "Evaluate the Keyfitz (1971) approximate population-growth momentum factor M = b e0 (1 - exp(-r mu)) / (r mu), the ratio by which a stable growing population would still grow after fertility instantly drops to replacement.",
  inputs: [
    {
      description: "Stable-population annual birth rate b.",
      id: "birthRateB",
      kind: "number",
      label: "Birth rate b",
      minimum: 0,
    },
    {
      description: "Life expectancy at birth e0 in years.",
      id: "lifeExpectancy0",
      kind: "number",
      label: "e0",
      minimum: 0,
    },
    {
      description: "Stable annual growth rate r (may be negative).",
      id: "growthRateR",
      kind: "number",
      label: "Growth rate r",
    },
    {
      description: "Mean age of childbearing mu in years.",
      id: "meanAgeChildbearing",
      kind: "number",
      label: "mu",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Momentum factor M; above one signals continued growth after replacement fertility.",
      id: "momentumFactor",
      kind: "number",
      label: "Momentum",
    },
  ],
  calculate: (input) =>
    calculateKeyfitzMomentumFactor(
      input as unknown as KeyfitzMomentumFactorInput,
    ),
});

export const runKeyfitzMomentumFactor = keyfitzMomentumFactorTool.execute;
export default keyfitzMomentumFactorTool;
