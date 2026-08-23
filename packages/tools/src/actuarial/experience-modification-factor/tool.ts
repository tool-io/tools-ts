import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExperienceModificationFactorInput = {
  readonly actualExcessLosses: number;
  readonly actualPrimaryLosses: number;
  readonly ballast: number;
  readonly excessWeight: number;
  readonly expectedExcessLosses: number;
  readonly expectedPrimaryLosses: number;
};

export type ExperienceModificationFactorOutput = {
  readonly modificationFactor: number;
};

export const experienceModificationFactorExample = {
  input: {
    actualExcessLosses: 80000,
    actualPrimaryLosses: 20000,
    ballast: 400000,
    excessWeight: 0.25,
    expectedExcessLosses: 75000,
    expectedPrimaryLosses: 25000,
  },
  output: {
    modificationFactor: 0.9925,
  },
} satisfies ToolExample<
  ExperienceModificationFactorInput,
  ExperienceModificationFactorOutput
>;

export const calculateExperienceModificationFactor = (
  input: ExperienceModificationFactorInput,
): ExperienceModificationFactorOutput => {
  const expectedLosses =
    input.expectedPrimaryLosses + input.expectedExcessLosses;
  if (!(expectedLosses > 0))
    simpleError(
      "expectedPrimaryLosses",
      "Expected losses must be positive to form a modification factor.",
      "positive_total_expected_losses_required",
    );
  return {
    modificationFactor:
      (input.actualPrimaryLosses +
        input.excessWeight * input.actualExcessLosses +
        (1 - input.excessWeight) * input.expectedExcessLosses +
        input.ballast) /
      (expectedLosses + input.ballast),
  };
};

export const experienceModificationFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateExperienceModificationFactor({
      actualExcessLosses: input.actualExcessLosses as number,
      actualPrimaryLosses: input.actualPrimaryLosses as number,
      ballast: input.ballast as number,
      excessWeight: input.excessWeight as number,
      expectedExcessLosses: input.expectedExcessLosses as number,
      expectedPrimaryLosses: input.expectedPrimaryLosses as number,
    }),
  description:
    "Calculate a workers' compensation experience modification factor using primary losses, weighted excess losses, expected losses, and a ballast value.",
  id: "actuarial/experience-modification-factor",
  inputs: [
    {
      description: "Actual excess losses for the experience period.",
      id: "actualExcessLosses",
      kind: "number",
      label: "Actual excess losses",
      minimum: 0,
    },
    {
      description: "Actual primary losses for the experience period.",
      id: "actualPrimaryLosses",
      kind: "number",
      label: "Actual primary losses",
      minimum: 0,
    },
    {
      description:
        "Ballast value that stabilizes the modification for smaller risks.",
      id: "ballast",
      kind: "number",
      label: "Ballast",
      minimum: 0,
    },
    {
      description:
        "Weight assigned to actual excess losses; the remainder is assigned to expected excess losses.",
      id: "excessWeight",
      kind: "number",
      label: "Excess loss weight",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Expected excess losses for the same exposure.",
      id: "expectedExcessLosses",
      kind: "number",
      label: "Expected excess losses",
      minimum: 0,
    },
    {
      description: "Expected primary losses for the same exposure.",
      id: "expectedPrimaryLosses",
      kind: "number",
      label: "Expected primary losses",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Multiplier applied to the manual premium; below one credits better-than-expected experience.",
      id: "modificationFactor",
      kind: "number",
      label: "Modification factor",
    },
  ],
  title: "Experience Modification Factor Calculator",
});
export const runExperienceModificationFactor =
  experienceModificationFactorTool.execute;
export default experienceModificationFactorTool;
