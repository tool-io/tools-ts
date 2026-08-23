import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LastSurvivorExpectationIdentityInput = {
  readonly firstLifeDeathProbability: number;
  readonly secondLifeDeathProbability: number;
};

export type LastSurvivorExpectationIdentityOutput = {
  readonly expectedYears: number;
};

export const lastSurvivorExpectationIdentityExample = {
  input: {
    firstLifeDeathProbability: 0.5,
    secondLifeDeathProbability: 0.5,
  },
  output: {
    expectedYears: 2.16404256133,
  },
} satisfies ToolExample<
  LastSurvivorExpectationIdentityInput,
  LastSurvivorExpectationIdentityOutput
>;

const forceFromDeathProbability = (deathProbability: number): number =>
  -Math.log(1 - deathProbability);

export const calculateLastSurvivorExpectationIdentity = (
  input: LastSurvivorExpectationIdentityInput,
): LastSurvivorExpectationIdentityOutput => {
  const firstForce = forceFromDeathProbability(input.firstLifeDeathProbability);
  const secondForce = forceFromDeathProbability(
    input.secondLifeDeathProbability,
  );
  if (firstForce === 0 || secondForce === 0)
    simpleError(
      "firstLifeDeathProbability",
      "The last survivor expectation is infinite when either life has zero mortality.",
      "series_diverges",
    );
  const jointForce = firstForce + secondForce;
  const identityValue = 1 / firstForce + 1 / secondForce - 1 / jointForce;
  return {
    expectedYears: roundStatistic(identityValue),
  };
};

export const lastSurvivorExpectationIdentityTool = createSimpleTool({
  calculate: (input) =>
    calculateLastSurvivorExpectationIdentity(
      input as unknown as LastSurvivorExpectationIdentityInput,
    ),
  description:
    "Calculate the last survivor life expectancy using the identity that combines both single-life expectancies minus the joint life expectancy.",
  id: "actuarial/last-survivor-expectation-identity",
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
      description: "Expected years until the second of the two lives dies.",
      id: "expectedYears",
      kind: "number",
      label: "Expected years",
    },
  ],
  title: "Last Survivor Expectation Identity Calculator",
});
export const runLastSurvivorExpectationIdentity =
  lastSurvivorExpectationIdentityTool.execute;
export default lastSurvivorExpectationIdentityTool;
