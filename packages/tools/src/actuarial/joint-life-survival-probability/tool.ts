import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type JointLifeSurvivalProbabilityInput = {
  readonly firstLifeDeathProbability: number;
  readonly secondLifeDeathProbability: number;
  readonly years: number;
};

export type JointLifeSurvivalProbabilityOutput = {
  readonly jointSurvivalProbability: number;
};

export const jointLifeSurvivalProbabilityExample = {
  input: {
    firstLifeDeathProbability: 0.1,
    secondLifeDeathProbability: 0.2,
    years: 2,
  },
  output: {
    jointSurvivalProbability: 0.5184,
  },
} satisfies ToolExample<
  JointLifeSurvivalProbabilityInput,
  JointLifeSurvivalProbabilityOutput
>;

export const calculateJointLifeSurvivalProbability = (
  input: JointLifeSurvivalProbabilityInput,
): JointLifeSurvivalProbabilityOutput => {
  const jointAnnualSurvival =
    (1 - input.firstLifeDeathProbability) *
    (1 - input.secondLifeDeathProbability);
  return {
    jointSurvivalProbability: roundStatistic(
      jointAnnualSurvival ** input.years,
    ),
  };
};

export const jointLifeSurvivalProbabilityTool = createSimpleTool({
  calculate: (input) =>
    calculateJointLifeSurvivalProbability(
      input as unknown as JointLifeSurvivalProbabilityInput,
    ),
  description:
    "Calculate the probability that two independent lives both survive the given number of years.",
  id: "actuarial/joint-life-survival-probability",
  inputs: [
    {
      description: "Annual death probability of the first life.",
      id: "firstLifeDeathProbability",
      kind: "number",
      label: "First life death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Annual death probability of the second life.",
      id: "secondLifeDeathProbability",
      kind: "number",
      label: "Second life death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Survival horizon in years.",
      id: "years",
      kind: "integer",
      label: "Years",
      maximum: 1200,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Probability that both lives survive the full horizon.",
      id: "jointSurvivalProbability",
      kind: "number",
      label: "Joint survival probability",
    },
  ],
  title: "Joint Life Survival Probability Calculator",
});
export const runJointLifeSurvivalProbability =
  jointLifeSurvivalProbabilityTool.execute;
export default jointLifeSurvivalProbabilityTool;
