import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolicyGradientStep = {
  readonly action: number;
  readonly advantage: number;
  readonly gradient: readonly number[];
  readonly logits: readonly number[];
  readonly probabilities: readonly number[];
};
const softmax = (logits: readonly number[]): number[] => {
  const maximum = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
};
export const calculatePolicyGradientStep = (
  logits: readonly number[],
  action: number,
  episodeReturn: number,
  baseline: number,
  learningRate: number,
): PolicyGradientStep | null => {
  if (logits.length < 2 || action >= logits.length) return null;
  const probabilities = softmax(logits);
  const advantage = episodeReturn - baseline;
  const gradient = probabilities.map(
    (probability, index) =>
      ((index === action ? 1 : 0) - probability) * advantage,
  );
  const nextLogits = logits.map(
    (value, index) => value + learningRate * (gradient[index] ?? 0),
  );
  if (![advantage, ...gradient, ...nextLogits].every(Number.isFinite))
    return null;
  return {
    action,
    advantage: Number(advantage.toPrecision(10)),
    gradient: gradient.map((value) => Number(value.toPrecision(10))),
    logits: nextLogits.map((value) => Number(value.toPrecision(10))),
    probabilities: softmax(nextLogits).map((value) =>
      Number(value.toPrecision(10)),
    ),
  };
};

export const policyGradientExample = {
  input: {
    action: 1,
    baseline: 0.5,
    episodeReturn: 2,
    learningRate: 0.1,
    logits: [0, 0, 0],
  },
  output: {
    update: {
      action: 1,
      advantage: 1.5,
      gradient: [-0.5, 1, -0.5],
      logits: [-0.05, 0.1, -0.05],
      probabilities: [0.316272114, 0.367455772, 0.316272114],
    },
  },
} satisfies ToolExample<
  {
    readonly action: number;
    readonly baseline: number;
    readonly episodeReturn: number;
    readonly learningRate: number;
    readonly logits: readonly number[];
  },
  { readonly update: PolicyGradientStep }
>;

export const policyGradientTool = createSimpleTool({
  id: "reinforcement-learning/policy-gradient-step",
  title: "Policy-Gradient Training Step",
  description:
    "Apply one categorical REINFORCE policy-gradient update from an action, return, and baseline.",
  inputs: [
    {
      format: "vector/logits",
      id: "logits",
      kind: "numberList",
      label: "Policy logits",
    },
    { id: "action", kind: "integer", label: "Selected action", minimum: 0 },
    { id: "episodeReturn", kind: "number", label: "Episode return" },
    { id: "baseline", kind: "number", label: "Baseline" },
    {
      id: "learningRate",
      kind: "number",
      label: "Learning rate",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "reinforcement-learning/policy-update",
      id: "update",
      kind: "object",
      label: "Policy update",
    },
  ],
  calculate: (input) => {
    const update = calculatePolicyGradientStep(
      input.logits as number[],
      input.action as number,
      input.episodeReturn as number,
      input.baseline as number,
      input.learningRate as number,
    );
    if (!update)
      return simpleError(
        "action",
        "Action must identify one of at least two logits.",
      );
    return { update };
  },
});
export const runPolicyGradient = policyGradientTool.execute;
export default policyGradientTool;
