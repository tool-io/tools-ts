import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecisionStump = {
  readonly alpha: number;
  readonly polarity: 1 | -1;
  readonly threshold: number;
};
export type AdaBoostModel = { readonly stumps: readonly DecisionStump[] };
const predictStump = (value: number, stump: Omit<DecisionStump, "alpha">) =>
  (value < stump.threshold ? -1 : 1) * stump.polarity;
export const trainAdaBoost = (
  values: readonly number[],
  labels: readonly number[],
  rounds: number,
): AdaBoostModel | null => {
  if (
    values.length < 2 ||
    values.length !== labels.length ||
    labels.some((label) => label !== -1 && label !== 1)
  )
    return null;
  let weights = values.map(() => 1 / values.length);
  const unique = [...new Set(values)].sort((a, b) => a - b),
    thresholds = [
      unique[0]! - 1,
      ...unique
        .slice(0, -1)
        .map((value, index) => (value + unique[index + 1]!) / 2),
      unique[unique.length - 1]! + 1,
    ];
  const stumps: DecisionStump[] = [];
  for (let round = 0; round < rounds; round += 1) {
    let best = {
      error: Infinity,
      polarity: 1 as 1 | -1,
      threshold: thresholds[0]!,
    };
    for (const threshold of thresholds)
      for (const polarity of [1, -1] as const) {
        const error = values.reduce(
          (sum, value, index) =>
            sum +
            (predictStump(value, { polarity, threshold }) === labels[index]
              ? 0
              : weights[index]!),
          0,
        );
        if (error < best.error) best = { error, polarity, threshold };
      }
    const bounded = Math.min(1 - 1e-12, Math.max(1e-12, best.error)),
      alpha = 0.5 * Math.log((1 - bounded) / bounded);
    const stump = {
      alpha: Number(alpha.toPrecision(12)),
      polarity: best.polarity,
      threshold: best.threshold,
    };
    stumps.push(stump);
    weights = weights.map(
      (weight, index) =>
        weight *
        Math.exp(-alpha * labels[index]! * predictStump(values[index]!, best)),
    );
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    weights = weights.map((weight) => weight / total);
  }
  return { stumps };
};
export const predictAdaBoost = (model: AdaBoostModel, value: number) =>
  model.stumps.reduce(
    (sum, stump) => sum + stump.alpha * predictStump(value, stump),
    0,
  ) >= 0
    ? 1
    : -1;
export const adaBoostExample = {
  input: { labels: [-1, -1, 1, 1], rounds: 1, values: [1, 2, 3, 4] },
  output: {
    model: { stumps: [{ alpha: 13.815510558, polarity: 1, threshold: 2.5 }] },
  },
} satisfies ToolExample<
  {
    readonly labels: readonly number[];
    readonly rounds: number;
    readonly values: readonly number[];
  },
  { readonly model: AdaBoostModel }
>;
export const adaBoostTool = createSimpleTool({
  id: "machine-learning/adaboost-classifier",
  title: "AdaBoost Classifier Demonstrator",
  description:
    "Train one-dimensional decision stumps with AdaBoost sample reweighting.",
  inputs: [
    {
      format: "dataset/feature",
      id: "values",
      kind: "numberList",
      label: "Feature values",
    },
    {
      format: "labels/binary-minus-plus",
      id: "labels",
      kind: "numberList",
      label: "Labels",
    },
    {
      id: "rounds",
      kind: "integer",
      label: "Boosting rounds",
      maximum: 100,
      minimum: 1,
    },
  ],
  outputs: [
    {
      format: "model/adaboost-stumps",
      id: "model",
      kind: "object",
      label: "AdaBoost model",
    },
  ],
  calculate: (input) => {
    const model = trainAdaBoost(
      input.values as number[],
      input.labels as number[],
      input.rounds as number,
    );
    if (!model)
      return simpleError(
        "labels",
        "Provide equally sized values and labels using only -1 and 1.",
      );
    return { model };
  },
});
export const runAdaBoost = adaBoostTool.execute;
export default adaBoostTool;
