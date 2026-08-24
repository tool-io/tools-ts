import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DigitizationPriorityScoreCalculatorInput = {
  readonly significanceScore: number;
  readonly conditionRiskScore: number;
  readonly demandScore: number;
  readonly significanceWeight?: number;
  readonly conditionWeight?: number;
  readonly demandWeight?: number;
};

export type DigitizationPriorityScoreCalculatorOutput = {
  readonly weightedPriorityScore: number;
};

export const calculateDigitizationPriorityScoreCalculator = (
  input: DigitizationPriorityScoreCalculatorInput,
): DigitizationPriorityScoreCalculatorOutput => {
  const weights = {
    significanceWeight: input.significanceWeight ?? 0.5,
    conditionWeight: input.conditionWeight ?? 0.3,
    demandWeight: input.demandWeight ?? 0.2,
  };
  for (const key of [
    "significanceScore",
    "conditionRiskScore",
    "demandScore",
  ] as const) {
    const value = input[key];
    if (!(typeof value === "number" && value >= 0 && value <= 100))
      simpleError(key, "Scores must lie between 0 and 100.", "invalid_score");
  }
  for (const [key, value] of Object.entries(weights)) {
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        key,
        "Weights must be finite numbers at least zero.",
        "invalid_weight",
      );
  }
  const weightScale = Math.max(
    weights.significanceWeight,
    weights.conditionWeight,
    weights.demandWeight,
  );
  if (weightScale === 0)
    simpleError(
      "significanceWeight",
      "At least one weight must be greater than zero.",
      "invalid_weight",
    );
  const significanceWeight = weights.significanceWeight / weightScale;
  const conditionWeight = weights.conditionWeight / weightScale;
  const demandWeight = weights.demandWeight / weightScale;
  const weightSum = significanceWeight + conditionWeight + demandWeight;
  const weightedPriorityScore =
    (significanceWeight * input.significanceScore +
      conditionWeight * input.conditionRiskScore +
      demandWeight * input.demandScore) /
    weightSum;
  return { weightedPriorityScore };
};

export const digitizationPriorityScoreCalculatorExample = {
  input: {
    significanceScore: 80,
    conditionRiskScore: 60,
    demandScore: 40,
  },
  output: { weightedPriorityScore: 66 },
} satisfies ToolExample<
  DigitizationPriorityScoreCalculatorInput,
  DigitizationPriorityScoreCalculatorOutput
>;

export const digitizationPriorityScoreCalculatorTool = createSimpleTool({
  id: "archival-studies/digitization-priority-score-calculator",
  title: "Digitization Priority Score Calculator",
  description:
    "Compute a weighted digitization priority score as the weight-normalized sum of significance, condition-risk and demand scores on 0-100 scales.",
  inputs: [
    {
      description: "Research and administrative significance rating, 0-100.",
      id: "significanceScore",
      kind: "number",
      label: "Significance",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Physical deterioration or condition risk rating, 0-100.",
      id: "conditionRiskScore",
      kind: "number",
      label: "Condition risk",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "User demand rating, 0-100.",
      id: "demandScore",
      kind: "number",
      label: "Demand",
      maximum: 100,
      minimum: 0,
    },
    {
      default: 0.5,
      description:
        "Relative weight applied to significance; zero excludes this component. At least one of the three weights must be positive.",
      id: "significanceWeight",
      kind: "number",
      label: "Significance weight",
      minimum: 0,
    },
    {
      default: 0.3,
      description:
        "Relative weight applied to condition risk; zero excludes this component.",
      id: "conditionWeight",
      kind: "number",
      label: "Condition weight",
      minimum: 0,
    },
    {
      default: 0.2,
      description:
        "Relative weight applied to demand; zero excludes this component.",
      id: "demandWeight",
      kind: "number",
      label: "Demand weight",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Weight-normalized priority score on the same 0-100 scale.",
      id: "weightedPriorityScore",
      kind: "number",
      label: "Priority score",
    },
  ],
  calculate: (input) =>
    calculateDigitizationPriorityScoreCalculator({
      conditionRiskScore: input.conditionRiskScore as number,
      conditionWeight:
        (input.conditionWeight as number | undefined) ?? undefined,
      demandScore: input.demandScore as number,
      demandWeight: (input.demandWeight as number | undefined) ?? undefined,
      significanceScore: input.significanceScore as number,
      significanceWeight:
        (input.significanceWeight as number | undefined) ?? undefined,
    }),
});

export const runDigitizationPriorityScoreCalculator =
  digitizationPriorityScoreCalculatorTool.execute;
export default digitizationPriorityScoreCalculatorTool;
