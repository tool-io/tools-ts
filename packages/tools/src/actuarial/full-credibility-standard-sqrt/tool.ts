import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FullCredibilityStandardSqrtInput = {
  readonly fullCredibilityCount: number;
  readonly observedCount: number;
};

export type FullCredibilityStandardSqrtOutput = {
  readonly credibilityFactor: number;
};

export const fullCredibilityStandardSqrtExample = {
  input: {
    fullCredibilityCount: 1600,
    observedCount: 400,
  },
  output: {
    credibilityFactor: 0.5,
  },
} satisfies ToolExample<
  FullCredibilityStandardSqrtInput,
  FullCredibilityStandardSqrtOutput
>;

export const calculateFullCredibilityStandardSqrt = (
  input: FullCredibilityStandardSqrtInput,
): FullCredibilityStandardSqrtOutput => {
  if (
    !Number.isFinite(input.fullCredibilityCount) ||
    !(input.fullCredibilityCount >= 1)
  )
    simpleError(
      "fullCredibilityCount",
      "The full credibility count must be at least one.",
      "positive_full_credibility_count_required",
    );
  if (!Number.isFinite(input.observedCount) || !(input.observedCount >= 0))
    simpleError(
      "observedCount",
      "The observed claim count must be finite and nonnegative.",
      "nonnegative_observed_count_required",
    );
  const ratio = input.observedCount / input.fullCredibilityCount;
  return {
    credibilityFactor: Math.min(1, Math.sqrt(ratio)),
  };
};

export const fullCredibilityStandardSqrtTool = createSimpleTool({
  calculate: (input) =>
    calculateFullCredibilityStandardSqrt({
      fullCredibilityCount: input.fullCredibilityCount as number,
      observedCount: input.observedCount as number,
    }),
  description:
    "Assign partial credibility to experience with the square root rule relative to the full credibility claim count.",
  id: "actuarial/full-credibility-standard-sqrt",
  inputs: [
    {
      description:
        "Claim count required for full credibility; must be at least one.",
      id: "fullCredibilityCount",
      kind: "number",
      label: "Full credibility count",
      minimum: 1,
    },
    {
      description: "Observed claim count in the experience period.",
      id: "observedCount",
      kind: "number",
      label: "Observed count",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Weight applied to the experience, capped at one for full credibility.",
      id: "credibilityFactor",
      kind: "number",
      label: "Credibility factor",
    },
  ],
  title: "Limited-Fluctuation Credibility Factor Calculator",
});
export const runFullCredibilityStandardSqrt =
  fullCredibilityStandardSqrtTool.execute;
export default fullCredibilityStandardSqrtTool;
