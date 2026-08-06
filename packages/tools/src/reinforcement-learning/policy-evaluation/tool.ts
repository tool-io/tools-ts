import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const evaluatePolicy = (
  rewards: readonly number[],
  transitions: readonly (readonly number[])[],
  discount: number,
  iterations: number,
): number[] | null => {
  if (
    transitions.length !== rewards.length ||
    transitions.some(
      (row) =>
        row.length !== rewards.length ||
        row.some((value) => value < 0) ||
        Math.abs(row.reduce((sum, value) => sum + value, 0) - 1) > 1e-9,
    )
  )
    return null;
  let values = Array<number>(rewards.length).fill(0);
  for (let iteration = 0; iteration < iterations; iteration += 1)
    values = rewards.map(
      (reward, state) =>
        reward +
        discount *
          (transitions[state] ?? []).reduce(
            (sum, probability, nextState) =>
              sum + probability * (values[nextState] ?? 0),
            0,
          ),
    );
  return values.every(Number.isFinite)
    ? values.map((value) => Number(value.toPrecision(10)))
    : null;
};

export const policyEvaluationExample = {
  input: {
    discount: 0.9,
    iterations: 100,
    rewards: [1, 0],
    transitions: [
      [0.5, 0.5],
      [0.2, 0.8],
    ],
  },
  output: { values: [3.835540549, 2.465677535] },
} satisfies ToolExample<
  {
    readonly discount: number;
    readonly iterations: number;
    readonly rewards: readonly number[];
    readonly transitions: readonly (readonly number[])[];
  },
  { readonly values: readonly number[] }
>;

export const policyEvaluationTool = createSimpleTool({
  id: "reinforcement-learning/policy-evaluation",
  title: "Reinforcement-Learning Policy Evaluator",
  description:
    "Evaluate a fixed finite-state policy by iterating rewards and its transition matrix.",
  inputs: [
    {
      format: "vector/rewards",
      id: "rewards",
      kind: "numberList",
      label: "State rewards",
    },
    {
      format: "matrix/transition",
      id: "transitions",
      kind: "matrix",
      label: "Transition matrix",
    },
    {
      id: "discount",
      kind: "number",
      label: "Discount factor",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
    {
      id: "iterations",
      kind: "integer",
      label: "Iterations",
      maximum: 100_000,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "vector/state-values",
      id: "values",
      kind: "numberList",
      label: "State values",
    },
  ],
  calculate: (input) => {
    const values = evaluatePolicy(
      input.rewards as number[],
      input.transitions as number[][],
      input.discount as number,
      input.iterations as number,
    );
    if (!values)
      return simpleError(
        "transitions",
        "Transition matrix must be square, nonnegative, and row-stochastic.",
      );
    return { values };
  },
});
export const runPolicyEvaluation = policyEvaluationTool.execute;
export default policyEvaluationTool;
