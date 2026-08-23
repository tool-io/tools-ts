import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RocAucInput = {
  readonly labels: readonly number[];
  readonly scores: readonly number[];
};

export type RocAucOutput = {
  readonly auc: number;
  readonly negatives: number;
  readonly positives: number;
};

/**
 * ROC AUC by the trapezoidal rule over scores sorted descending. Ties are
 * handled exactly: all instances sharing a score advance TP and FP
 * together and contribute a single ROC point, so tied groups form one
 * step and the result equals the Mann-Whitney U statistic.
 */
export const calculateRocAuc = (input: RocAucInput): RocAucOutput => {
  const { labels, scores } = input;
  if (labels.length === 0 || scores.length === 0)
    simpleError("scores", "Provide at least one score.", "empty_sample");
  if (labels.length !== scores.length)
    simpleError(
      "labels",
      "Scores and labels must have the same length.",
      "length_mismatch",
    );
  for (const label of labels)
    if (label !== 0 && label !== 1)
      simpleError(
        "labels",
        "Labels must be 0 (negative) or 1 (positive).",
        "invalid_label",
      );
  const positives = labels.filter((label) => label === 1).length;
  const negatives = labels.length - positives;
  if (positives === 0 || negatives === 0)
    simpleError(
      "labels",
      "Both positive and negative labels are required.",
      "missing_class",
    );
  const order = [...scores.keys()].sort(
    (left, right) => scores[right]! - scores[left]! || left - right,
  );
  let truePositives = 0;
  let falsePositives = 0;
  let auc = 0;
  let previousFalsePositiveRate = 0;
  let previousTruePositiveRate = 0;
  let index = 0;
  while (index < order.length) {
    // Consume the whole tie group at this score as one threshold.
    const thresholdScore = scores[order[index]!]!;
    do {
      if (labels[order[index]!] === 1) truePositives += 1;
      else falsePositives += 1;
      index += 1;
    } while (index < order.length && scores[order[index]!] === thresholdScore);
    const falsePositiveRate = falsePositives / negatives;
    const truePositiveRate = truePositives / positives;
    auc +=
      ((falsePositiveRate - previousFalsePositiveRate) *
        (previousTruePositiveRate + truePositiveRate)) /
      2;
    previousFalsePositiveRate = falsePositiveRate;
    previousTruePositiveRate = truePositiveRate;
  }
  return { auc, negatives, positives };
};

export const rocAucExample = {
  input: { labels: [1, 0, 1, 0], scores: [0.9, 0.8, 0.7, 0.6] },
  output: { auc: 0.75, negatives: 2, positives: 2 },
} satisfies ToolExample<RocAucInput, RocAucOutput>;

export const rocAucTool = createSimpleTool({
  id: "classification/roc-auc",
  title: "ROC AUC Calculator",
  description:
    "Area under the ROC curve via the trapezoidal rule over descending scores; equal scores share one threshold point so ties are handled exactly.",
  inputs: [
    {
      description: "Predicted scores, higher means more positive.",
      id: "scores",
      kind: "numberList",
      label: "Scores",
    },
    {
      description: "True labels aligned with scores: 1 positive, 0 negative.",
      id: "labels",
      kind: "numberList",
      label: "Labels",
    },
  ],
  outputs: [
    {
      description: "Trapezoidal area under the ROC curve between 0 and 1.",
      id: "auc",
      kind: "number",
      label: "AUC",
    },
    {
      description: "Count of positive labels.",
      id: "positives",
      kind: "integer",
      label: "Positives",
    },
    {
      description: "Count of negative labels.",
      id: "negatives",
      kind: "integer",
      label: "Negatives",
    },
  ],
  calculate: (input) =>
    calculateRocAuc({
      labels: input.labels as readonly number[],
      scores: input.scores as readonly number[],
    }),
});

export const runRocAuc = rocAucTool.execute;
export default rocAucTool;
