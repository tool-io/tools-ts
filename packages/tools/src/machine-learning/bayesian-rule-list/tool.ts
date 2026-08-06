import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BayesianRule = {
  readonly feature: string;
  readonly negativeRate: number;
  readonly positiveRate: number;
  readonly score: number;
};
export const buildBayesianRuleList = (
  features: readonly (readonly number[])[],
  labels: readonly number[],
  featureNames: readonly string[],
  priorAlpha: number,
  priorBeta: number,
): BayesianRule[] | null => {
  const columns = features[0]?.length ?? 0;
  if (
    !features.length ||
    columns !== featureNames.length ||
    features.length !== labels.length ||
    features.some(
      (row) =>
        row.length !== columns ||
        row.some((value) => value !== 0 && value !== 1),
    ) ||
    labels.some((value) => value !== 0 && value !== 1)
  )
    return null;
  return featureNames
    .map((feature, column) => {
      let positiveTrue = 0,
        positiveCount = 0,
        negativeTrue = 0,
        negativeCount = 0;
      for (let row = 0; row < features.length; row += 1)
        if (features[row]![column] === 1) {
          positiveCount += 1;
          positiveTrue += labels[row]!;
        } else {
          negativeCount += 1;
          negativeTrue += labels[row]!;
        }
      const positiveRate =
          (positiveTrue + priorAlpha) /
          (positiveCount + priorAlpha + priorBeta),
        negativeRate =
          (negativeTrue + priorAlpha) /
          (negativeCount + priorAlpha + priorBeta);
      return {
        feature,
        negativeRate: Number(negativeRate.toPrecision(12)),
        positiveRate: Number(positiveRate.toPrecision(12)),
        score: Number(Math.abs(positiveRate - negativeRate).toPrecision(12)),
      };
    })
    .sort((a, b) => b.score - a.score || a.feature.localeCompare(b.feature));
};
export const bayesianRuleListExample = {
  input: {
    featureNames: ["sunny", "weekend"],
    features: [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
    labels: [1, 1, 0, 0],
    priorAlpha: 1,
    priorBeta: 1,
  },
  output: {
    rules: {
      values: [
        {
          feature: "sunny",
          negativeRate: 0.25,
          positiveRate: 0.75,
          score: 0.5,
        },
        { feature: "weekend", negativeRate: 0.5, positiveRate: 0.5, score: 0 },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly featureNames: readonly string[];
    readonly features: readonly (readonly number[])[];
    readonly labels: readonly number[];
    readonly priorAlpha: number;
    readonly priorBeta: number;
  },
  { readonly rules: { readonly values: readonly BayesianRule[] } }
>;
export const bayesianRuleListTool = createSimpleTool({
  id: "machine-learning/bayesian-rule-list",
  title: "Bayesian Rule List Demonstrator",
  description:
    "Rank binary feature rules by posterior positive-rate separation with Beta priors.",
  inputs: [
    {
      format: "matrix/binary-features",
      id: "features",
      kind: "matrix",
      label: "Binary features",
    },
    {
      format: "labels/binary-zero-one",
      id: "labels",
      kind: "numberList",
      label: "Labels",
    },
    {
      format: "feature-names",
      id: "featureNames",
      kind: "stringList",
      label: "Feature names",
    },
    {
      id: "priorAlpha",
      kind: "number",
      label: "Prior alpha",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "priorBeta",
      kind: "number",
      label: "Prior beta",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "model/bayesian-rule-list",
      id: "rules",
      kind: "object",
      label: "Ranked rules",
    },
  ],
  calculate: (input) => {
    const values = buildBayesianRuleList(
      input.features as number[][],
      input.labels as number[],
      input.featureNames as string[],
      input.priorAlpha as number,
      input.priorBeta as number,
    );
    if (!values)
      return simpleError(
        "features",
        "Provide matching binary feature rows, labels, and feature names.",
      );
    return { rules: { values } };
  },
});
export const runBayesianRuleList = bayesianRuleListTool.execute;
export default bayesianRuleListTool;
