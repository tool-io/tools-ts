import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrategyRobustnessInput = {
  readonly maximumRiskScore: number;
  readonly minimumPayoffScore: number;
  readonly payoffScores: ReadonlyArray<number>;
  readonly quadrantIds: ReadonlyArray<string>;
  readonly riskScores: ReadonlyArray<number>;
};

export type StrategyRobustnessOutput = {
  readonly averagePayoffScore: number;
  readonly averageRiskScore: number;
  readonly robust: boolean;
  readonly weakestPayoffQuadrantId: string;
};

export const scoreStrategyRobustnessAcrossQuadrants = (
  input: StrategyRobustnessInput,
): StrategyRobustnessOutput => {
  if (!Array.isArray(input.quadrantIds) || input.quadrantIds.length === 0)
    simpleError(
      "quadrantIds",
      "At least one quadrant ID is required.",
      "quadrant_ids_required",
    );
  if (
    !Array.isArray(input.payoffScores) ||
    input.payoffScores.length !== input.quadrantIds.length
  )
    simpleError(
      "payoffScores",
      "Each quadrant must have one payoff score.",
      "payoff_scores_length_mismatch",
    );
  if (
    !Array.isArray(input.riskScores) ||
    input.riskScores.length !== input.quadrantIds.length
  )
    simpleError(
      "riskScores",
      "Each quadrant must have one risk score.",
      "risk_scores_length_mismatch",
    );
  const quadrantIds = input.quadrantIds.map((quadrantId, index) => {
    if (typeof quadrantId !== "string" || quadrantId.trim() === "")
      simpleError(
        `quadrantIds.${index}`,
        "Quadrant IDs must be nonempty strings.",
        "invalid_quadrant_id",
      );
    return quadrantId.trim();
  });
  if (new Set(quadrantIds).size !== quadrantIds.length)
    simpleError(
      "quadrantIds",
      "Quadrant IDs must be unique.",
      "duplicate_quadrant_id",
    );
  for (const [field, scores, maximum] of [
    ["payoffScores", input.payoffScores, 100],
    ["riskScores", input.riskScores, 100],
  ] as const)
    for (const [index, score] of scores.entries())
      if (!Number.isFinite(score) || score < 0 || score > maximum)
        simpleError(
          `${field}.${index}`,
          "Scores must be finite values from 0 through 100.",
          "score_out_of_range",
        );
  for (const [field, threshold] of [
    ["minimumPayoffScore", input.minimumPayoffScore],
    ["maximumRiskScore", input.maximumRiskScore],
  ] as const)
    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100)
      simpleError(
        field,
        "Thresholds must be finite values from 0 through 100.",
        "threshold_out_of_range",
      );
  const weakestPayoffIndex = input.payoffScores.indexOf(
    Math.min(...input.payoffScores),
  );
  const averagePayoffScore =
    input.payoffScores.reduce((total, score) => total + score, 0) /
    input.payoffScores.length;
  const averageRiskScore =
    input.riskScores.reduce((total, score) => total + score, 0) /
    input.riskScores.length;
  if (
    !Number.isFinite(averagePayoffScore) ||
    !Number.isFinite(averageRiskScore)
  )
    simpleError("", "The robustness score is not finite.", "result_not_finite");
  return {
    averagePayoffScore,
    averageRiskScore,
    robust:
      input.payoffScores.every((score) => score >= input.minimumPayoffScore) &&
      input.riskScores.every((score) => score <= input.maximumRiskScore),
    weakestPayoffQuadrantId: quadrantIds[weakestPayoffIndex]!,
  };
};

export const strategyRobustnessExample = {
  input: {
    maximumRiskScore: 60,
    minimumPayoffScore: 50,
    payoffScores: [80, 60, 70, 55],
    quadrantIds: ["A", "B", "C", "D"],
    riskScores: [30, 50, 40, 60],
  },
  output: {
    averagePayoffScore: 66.25,
    averageRiskScore: 45,
    robust: true,
    weakestPayoffQuadrantId: "D",
  },
} satisfies ToolExample<StrategyRobustnessInput, StrategyRobustnessOutput>;

export const strategyRobustnessTool = createSimpleTool({
  calculate: (input) =>
    scoreStrategyRobustnessAcrossQuadrants({
      maximumRiskScore: input.maximumRiskScore as number,
      minimumPayoffScore: input.minimumPayoffScore as number,
      payoffScores: input.payoffScores as number[],
      quadrantIds: input.quadrantIds as string[],
      riskScores: input.riskScores as number[],
    }),
  description:
    "Score a strategy across caller-supplied payoff and risk scores and test every quadrant against explicit robustness thresholds.",
  id: "futurology/strategy-robustness-across-quadrants-score",
  inputs: [
    {
      id: "maximumRiskScore",
      kind: "number",
      label: "Maximum acceptable risk score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "minimumPayoffScore",
      kind: "number",
      label: "Minimum acceptable payoff score",
      maximum: 100,
      minimum: 0,
    },
    { id: "payoffScores", kind: "numberList", label: "Payoff scores" },
    { id: "quadrantIds", kind: "stringList", label: "Quadrant IDs" },
    { id: "riskScores", kind: "numberList", label: "Risk scores" },
  ],
  outputs: [
    {
      id: "averagePayoffScore",
      kind: "number",
      label: "Average payoff score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "averageRiskScore",
      kind: "number",
      label: "Average risk score",
      maximum: 100,
      minimum: 0,
    },
    { id: "robust", kind: "boolean", label: "Strategy robust" },
    {
      id: "weakestPayoffQuadrantId",
      kind: "string",
      label: "Weakest payoff quadrant",
    },
  ],
  title: "Strategy Robustness Across Quadrants Score",
});

export const runStrategyRobustness = strategyRobustnessTool.execute;
export default strategyRobustnessTool;
