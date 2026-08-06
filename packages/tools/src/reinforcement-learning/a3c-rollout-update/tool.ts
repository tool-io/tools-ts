import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type A3cRolloutUpdate = {
  readonly actorLoss: number;
  readonly advantages: readonly number[];
  readonly criticLoss: number;
  readonly returns: readonly number[];
  readonly totalLoss: number;
};
const round = (value: number): number => Number(value.toPrecision(12));
export const calculateA3cRolloutUpdate = (
  rewards: readonly number[],
  values: readonly number[],
  actionLogProbabilities: readonly number[],
  entropies: readonly number[],
  bootstrapValue: number,
  discountFactor: number,
  valueLossCoefficient: number,
  entropyCoefficient: number,
): A3cRolloutUpdate | null => {
  if (
    values.length !== rewards.length ||
    actionLogProbabilities.length !== rewards.length ||
    entropies.length !== rewards.length
  )
    return null;
  const returns = new Array<number>(rewards.length);
  let discountedReturn = bootstrapValue;
  for (let index = rewards.length - 1; index >= 0; index -= 1) {
    discountedReturn =
      (rewards[index] ?? 0) + discountFactor * discountedReturn;
    returns[index] = discountedReturn;
  }
  const advantages = returns.map(
    (value, index) => value - (values[index] ?? 0),
  );
  const actorLoss =
    -advantages.reduce(
      (total, advantage, index) =>
        total +
        (actionLogProbabilities[index] ?? 0) * advantage +
        entropyCoefficient * (entropies[index] ?? 0),
      0,
    ) / rewards.length;
  const criticLoss =
    advantages.reduce((total, advantage) => total + advantage ** 2, 0) /
    (2 * rewards.length);
  const totalLoss = actorLoss + valueLossCoefficient * criticLoss;
  return [actorLoss, criticLoss, totalLoss, ...advantages].every(
    Number.isFinite,
  )
    ? {
        actorLoss: round(actorLoss),
        advantages: advantages.map(round),
        criticLoss: round(criticLoss),
        returns: returns.map(round),
        totalLoss: round(totalLoss),
      }
    : null;
};

export const a3cRolloutExample = {
  input: {
    actionLogProbabilities: [-0.2, -0.5, -0.1],
    bootstrapValue: 0,
    discountFactor: 0.99,
    entropies: [0.5, 0.6, 0.4],
    entropyCoefficient: 0.01,
    rewards: [1, 0, 2],
    valueLossCoefficient: 0.5,
    values: [0.5, 0.4, 0.8],
  },
  output: {
    update: {
      actorLoss: 0.462346666667,
      advantages: [2.4602, 1.58, 1.2],
      criticLoss: 1.66483067333,
      returns: [2.9602, 1.98, 2],
      totalLoss: 1.29476200333,
    },
  },
} satisfies ToolExample<
  {
    readonly actionLogProbabilities: readonly number[];
    readonly bootstrapValue: number;
    readonly discountFactor: number;
    readonly entropies: readonly number[];
    readonly entropyCoefficient: number;
    readonly rewards: readonly number[];
    readonly valueLossCoefficient: number;
    readonly values: readonly number[];
  },
  { readonly update: A3cRolloutUpdate }
>;

export const a3cRolloutTool = createSimpleTool({
  id: "reinforcement-learning/a3c-rollout-update",
  title: "A3C Rollout Update Calculator",
  description:
    "Calculate discounted returns, advantages, and A3C rollout losses.",
  inputs: [
    {
      format: "vector/rewards",
      id: "rewards",
      kind: "numberList",
      label: "Rewards",
    },
    {
      format: "vector/state-values",
      id: "values",
      kind: "numberList",
      label: "State values",
    },
    {
      format: "vector/log-probabilities",
      id: "actionLogProbabilities",
      kind: "numberList",
      label: "Action log probabilities",
    },
    {
      format: "vector/entropies",
      id: "entropies",
      kind: "numberList",
      label: "Policy entropies",
    },
    { id: "bootstrapValue", kind: "number", label: "Bootstrap value" },
    {
      id: "discountFactor",
      kind: "number",
      label: "Discount factor",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "valueLossCoefficient",
      kind: "number",
      label: "Value loss coefficient",
      minimum: 0,
    },
    {
      id: "entropyCoefficient",
      kind: "number",
      label: "Entropy coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      format: "reinforcement-learning/a3c-update",
      id: "update",
      kind: "object",
      label: "A3C rollout update",
    },
  ],
  calculate: (input) => {
    const update = calculateA3cRolloutUpdate(
      input.rewards as number[],
      input.values as number[],
      input.actionLogProbabilities as number[],
      input.entropies as number[],
      input.bootstrapValue as number,
      input.discountFactor as number,
      input.valueLossCoefficient as number,
      input.entropyCoefficient as number,
    );
    if (!update)
      return simpleError(
        "values",
        "Rewards, values, log probabilities, and entropies must have equal lengths.",
      );
    return { update };
  },
});
export const runA3cRollout = a3cRolloutTool.execute;
export default a3cRolloutTool;
