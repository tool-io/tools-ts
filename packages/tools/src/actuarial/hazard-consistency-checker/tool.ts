import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HazardConsistencyCheckerInput = {
  readonly annualDeathProbability: number;
  readonly forceOfMortality: number;
  readonly tolerance?: number;
};

export type HazardConsistencyCheckerOutput = {
  readonly consistent: boolean;
  readonly impliedDeathProbability: number;
};

export const hazardConsistencyCheckerExample = {
  input: {
    annualDeathProbability: 0.5,
    forceOfMortality: 0.6931471805599453,
  },
  output: {
    consistent: true,
    impliedDeathProbability: 0.5,
  },
} satisfies ToolExample<
  HazardConsistencyCheckerInput,
  HazardConsistencyCheckerOutput
>;

export const calculateHazardConsistency = (
  input: HazardConsistencyCheckerInput,
): HazardConsistencyCheckerOutput => {
  if (
    !Number.isFinite(input.annualDeathProbability) ||
    input.annualDeathProbability < 0 ||
    input.annualDeathProbability > 1
  )
    simpleError(
      "annualDeathProbability",
      "Annual death probability must be between zero and one.",
      "invalid_death_probability",
    );
  if (!Number.isFinite(input.forceOfMortality) || input.forceOfMortality < 0)
    simpleError(
      "forceOfMortality",
      "The force of mortality must be finite and nonnegative.",
      "invalid_force_of_mortality",
    );
  const tolerance = input.tolerance ?? 1e-9;
  if (!Number.isFinite(tolerance) || !(tolerance >= 0))
    simpleError(
      "tolerance",
      "The tolerance must be finite and nonnegative.",
      "invalid_tolerance",
    );
  const impliedDeathProbability = -Math.expm1(-input.forceOfMortality);
  return {
    consistent:
      Math.abs(impliedDeathProbability - input.annualDeathProbability) <=
      tolerance,
    impliedDeathProbability,
  };
};

export const hazardConsistencyCheckerTool = createSimpleTool({
  calculate: (input) =>
    calculateHazardConsistency({
      annualDeathProbability: input.annualDeathProbability as number,
      forceOfMortality: input.forceOfMortality as number,
      tolerance: input.tolerance as number,
    }),
  description:
    "Check whether an annual death probability matches a constant force of mortality within a tolerance.",
  id: "actuarial/hazard-consistency-checker",
  inputs: [
    {
      description: "Annual death probability to verify.",
      id: "annualDeathProbability",
      kind: "number",
      label: "Annual death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Constant force of mortality over the year.",
      id: "forceOfMortality",
      kind: "number",
      label: "Force of mortality",
      minimum: 0,
    },
    {
      default: 1e-9,
      description: "Maximum allowed absolute difference.",
      id: "tolerance",
      kind: "number",
      label: "Tolerance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Whether the death probability matches the force of mortality.",
      id: "consistent",
      kind: "boolean",
      label: "Consistent",
    },
    {
      description: "Death probability implied by the given force of mortality.",
      id: "impliedDeathProbability",
      kind: "number",
      label: "Implied death probability",
    },
  ],
  title: "Hazard Consistency Checker",
});
export const runHazardConsistencyChecker = hazardConsistencyCheckerTool.execute;
export default hazardConsistencyCheckerTool;
