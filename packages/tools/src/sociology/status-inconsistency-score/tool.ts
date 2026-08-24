import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StatusInconsistencyScoreInput = {
  readonly educationRankPercent: number;
  readonly incomeRankPercent: number;
  readonly prestigeRankPercent: number;
};

export type StatusInconsistencyScoreOutput = {
  readonly inconsistencyRange: number;
};

export const statusInconsistencyScoreExample = {
  input: {
    educationRankPercent: 90,
    incomeRankPercent: 40,
    prestigeRankPercent: 70,
  },
  output: {
    inconsistencyRange: 50,
  },
} satisfies ToolExample<
  StatusInconsistencyScoreInput,
  StatusInconsistencyScoreOutput
>;

export const calculateStatusInconsistency = (
  input: StatusInconsistencyScoreInput,
): StatusInconsistencyScoreOutput => {
  if (
    !Number.isFinite(input.educationRankPercent) ||
    input.educationRankPercent < 0 ||
    input.educationRankPercent > 100
  )
    simpleError(
      "educationRankPercent",
      "Education rank must be between zero and one hundred.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.incomeRankPercent) ||
    input.incomeRankPercent < 0 ||
    input.incomeRankPercent > 100
  )
    simpleError(
      "incomeRankPercent",
      "Income rank must be between zero and one hundred.",
      "invalid_value",
    );
  if (
    !Number.isFinite(input.prestigeRankPercent) ||
    input.prestigeRankPercent < 0 ||
    input.prestigeRankPercent > 100
  )
    simpleError(
      "prestigeRankPercent",
      "Prestige rank must be between zero and one hundred.",
      "invalid_value",
    );
  const ranks = [
    input.educationRankPercent,
    input.incomeRankPercent,
    input.prestigeRankPercent,
  ];
  return {
    inconsistencyRange: Math.max(...ranks) - Math.min(...ranks),
  };
};

export const statusInconsistencyScoreTool = createSimpleTool({
  calculate: (input) =>
    calculateStatusInconsistency({
      educationRankPercent: input.educationRankPercent as number,
      incomeRankPercent: input.incomeRankPercent as number,
      prestigeRankPercent: input.prestigeRankPercent as number,
    }),
  description:
    "Score status inconsistency as the spread across education, income, and occupational prestige rank percentiles.",
  id: "sociology/status-inconsistency-score",
  inputs: [
    {
      description: "Percentile rank of educational attainment.",
      id: "educationRankPercent",
      kind: "number",
      label: "Education rank",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Percentile rank of income.",
      id: "incomeRankPercent",
      kind: "number",
      label: "Income rank",
      maximum: 100,
      minimum: 0,
    },
    {
      description: "Percentile rank of occupational prestige.",
      id: "prestigeRankPercent",
      kind: "number",
      label: "Prestige rank",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Range between the highest and lowest of the three ranks.",
      id: "inconsistencyRange",
      kind: "number",
      label: "Inconsistency",
      unit: "pct pts",
    },
  ],
  title: "Status Inconsistency Score Calculator",
});
export const runStatusInconsistencyScore = statusInconsistencyScoreTool.execute;
export default statusInconsistencyScoreTool;
