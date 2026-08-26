import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StableEquivalentPopulationSizeInput = {
  readonly annualBirths: number;
  readonly intrinsicBirthRateB: number;
};

export type StableEquivalentPopulationSizeOutput = {
  readonly stableEquivalentSize: number;
};

export const calculateStableEquivalentPopulationSize = (
  input: StableEquivalentPopulationSizeInput,
): StableEquivalentPopulationSizeOutput => {
  if (!(input.annualBirths >= 0))
    simpleError(
      "annualBirths",
      "Annual births must be non-negative.",
      "invalid_births",
    );
  if (!(input.intrinsicBirthRateB > 0))
    simpleError(
      "intrinsicBirthRateB",
      "The intrinsic birth rate must be greater than zero.",
      "invalid_rate",
    );
  return {
    stableEquivalentSize: input.annualBirths / input.intrinsicBirthRateB,
  };
};

export const stableEquivalentPopulationSizeExample = {
  input: { annualBirths: 140000, intrinsicBirthRateB: 0.03 },
  output: { stableEquivalentSize: 4666666.666666667 },
} satisfies ToolExample<
  StableEquivalentPopulationSizeInput,
  StableEquivalentPopulationSizeOutput
>;

export const stableEquivalentPopulationSizeTool = createSimpleTool({
  id: "demography/stable-equivalent-population-size",
  title: "Stable Equivalent Population Size Calculator",
  description:
    "Compute the stable-equivalent population size as observed annual births divided by the intrinsic birth rate b.",
  inputs: [
    {
      description: "Observed annual births B in the population.",
      id: "annualBirths",
      kind: "number",
      label: "Annual births",
      minimum: 0,
    },
    {
      description:
        "Intrinsic annual birth rate b of the matching stable population.",
      id: "intrinsicBirthRateB",
      kind: "number",
      label: "Intrinsic b",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Stable-equivalent population size B / b.",
      id: "stableEquivalentSize",
      kind: "number",
      label: "Stable equivalent",
    },
  ],
  calculate: (input) =>
    calculateStableEquivalentPopulationSize(
      input as unknown as StableEquivalentPopulationSizeInput,
    ),
});

export const runStableEquivalentPopulationSize =
  stableEquivalentPopulationSizeTool.execute;
export default stableEquivalentPopulationSizeTool;
