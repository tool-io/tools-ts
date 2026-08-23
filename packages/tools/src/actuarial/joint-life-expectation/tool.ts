import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type JointLifeExpectationInput = {
  readonly firstLifeDeathProbability: number;
  readonly secondLifeDeathProbability: number;
};

export type JointLifeExpectationOutput = {
  readonly expectedYears: number;
};

export const jointLifeExpectationExample = {
  input: {
    firstLifeDeathProbability: 0.5,
    secondLifeDeathProbability: 0.5,
  },
  output: {
    expectedYears: 0.721347520444,
  },
} satisfies ToolExample<JointLifeExpectationInput, JointLifeExpectationOutput>;

export const calculateJointLifeExpectation = (
  input: JointLifeExpectationInput,
): JointLifeExpectationOutput => {
  const totalForce =
    -Math.log(1 - input.firstLifeDeathProbability) -
    Math.log(1 - input.secondLifeDeathProbability);
  if (totalForce === 0)
    simpleError(
      "firstLifeDeathProbability",
      "The joint life expectancy is infinite unless at least one life has positive mortality.",
      "series_diverges",
    );
  return {
    expectedYears: roundStatistic(1 / totalForce),
  };
};

export const jointLifeExpectationTool = createSimpleTool({
  calculate: (input) =>
    calculateJointLifeExpectation(
      input as unknown as JointLifeExpectationInput,
    ),
  description:
    "Calculate the complete expected lifetime of the joint status of two independent lives under constant forces of mortality derived from annual death probabilities.",
  id: "actuarial/joint-life-expectation",
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
  ],
  outputs: [
    {
      description: "Expected years until the first of the two lives dies.",
      id: "expectedYears",
      kind: "number",
      label: "Expected years",
    },
  ],
  title: "Joint Life Expectation Calculator",
});
export const runJointLifeExpectation = jointLifeExpectationTool.execute;
export default jointLifeExpectationTool;
