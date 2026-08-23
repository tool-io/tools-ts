import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LastSurvivorProbabilityInput = {
  readonly firstLifeDeathProbability: number;
  readonly secondLifeDeathProbability: number;
  readonly years: number;
};

export type LastSurvivorProbabilityOutput = {
  readonly lastSurvivorProbability: number;
};

export const lastSurvivorProbabilityExample = {
  input: {
    firstLifeDeathProbability: 0.1,
    secondLifeDeathProbability: 0.2,
    years: 1,
  },
  output: {
    lastSurvivorProbability: 0.98,
  },
} satisfies ToolExample<
  LastSurvivorProbabilityInput,
  LastSurvivorProbabilityOutput
>;

export const calculateLastSurvivorProbability = (
  input: LastSurvivorProbabilityInput,
): LastSurvivorProbabilityOutput => {
  const firstSurvival = (1 - input.firstLifeDeathProbability) ** input.years;
  const secondSurvival = (1 - input.secondLifeDeathProbability) ** input.years;
  return {
    lastSurvivorProbability: roundStatistic(
      1 - (1 - firstSurvival) * (1 - secondSurvival),
    ),
  };
};

export const lastSurvivorProbabilityTool = createSimpleTool({
  calculate: (input) =>
    calculateLastSurvivorProbability(
      input as unknown as LastSurvivorProbabilityInput,
    ),
  description:
    "Calculate the probability that at least one of two independent lives survives the given number of years.",
  id: "actuarial/last-survivor-probability",
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
      description:
        "Probability that at least one life survives the full horizon.",
      id: "lastSurvivorProbability",
      kind: "number",
      label: "Last survivor probability",
    },
  ],
  title: "Last Survivor Probability Calculator",
});
export const runLastSurvivorProbability = lastSurvivorProbabilityTool.execute;
export default lastSurvivorProbabilityTool;
