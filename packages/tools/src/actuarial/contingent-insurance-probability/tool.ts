import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContingentInsuranceProbabilityInput = {
  readonly firstLifeDeathProbability: number;
  readonly secondLifeDeathProbability: number;
};

export type ContingentInsuranceProbabilityOutput = {
  readonly firstToDieProbability: number;
};

export const contingentInsuranceProbabilityExample = {
  input: {
    firstLifeDeathProbability: 0.5,
    secondLifeDeathProbability: 0.5,
  },
  output: {
    firstToDieProbability: 0.5,
  },
} satisfies ToolExample<
  ContingentInsuranceProbabilityInput,
  ContingentInsuranceProbabilityOutput
>;

const forceFromDeathProbability = (deathProbability: number): number =>
  deathProbability === 0 ? 0 : -Math.log(1 - deathProbability);

export const calculateContingentInsuranceProbability = (
  input: ContingentInsuranceProbabilityInput,
): ContingentInsuranceProbabilityOutput => {
  for (const [field, probability] of [
    ["firstLifeDeathProbability", input.firstLifeDeathProbability],
    ["secondLifeDeathProbability", input.secondLifeDeathProbability],
  ] as const)
    if (probability < 0 || probability >= 1)
      simpleError(
        field,
        "Annual death probability must be at least zero and less than one.",
        "invalid_probability",
      );
  const firstForce = forceFromDeathProbability(input.firstLifeDeathProbability);
  const secondForce = forceFromDeathProbability(
    input.secondLifeDeathProbability,
  );
  const totalForce = firstForce + secondForce;
  if (totalForce === 0)
    simpleError(
      "firstLifeDeathProbability",
      "At least one life must have positive mortality for a first-to-die event to occur.",
      "undefined_probability",
    );
  return {
    firstToDieProbability: firstForce / totalForce,
  };
};

export const contingentInsuranceProbabilityTool = createSimpleTool({
  calculate: (input) =>
    calculateContingentInsuranceProbability({
      firstLifeDeathProbability: input.firstLifeDeathProbability as number,
      secondLifeDeathProbability: input.secondLifeDeathProbability as number,
    }),
  description:
    "Calculate the probability that the first life dies before the second life under constant forces of mortality derived from annual death probabilities.",
  id: "actuarial/contingent-insurance-probability",
  inputs: [
    {
      description: "Annual death probability of the first life.",
      id: "firstLifeDeathProbability",
      kind: "number",
      label: "First life death probability",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
    {
      description: "Annual death probability of the second life.",
      id: "secondLifeDeathProbability",
      kind: "number",
      label: "Second life death probability",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Probability that the first life dies before the second.",
      id: "firstToDieProbability",
      kind: "number",
      label: "First to die probability",
    },
  ],
  title: "Contingent Insurance Probability Calculator",
});
export const runContingentInsuranceProbability =
  contingentInsuranceProbabilityTool.execute;
export default contingentInsuranceProbabilityTool;
