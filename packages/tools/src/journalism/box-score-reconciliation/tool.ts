import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly periodScores: readonly number[];
  readonly publishedTeamTotal: number;
  readonly tolerance: number;
}>;
export type Output = Readonly<{
  readonly computedTeamTotal: number;
  readonly difference: number;
  readonly reconciles: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.periodScores.some((value) => value < 0))
    simpleError(
      "periodScores",
      "Period scores must be nonnegative.",
      "negative_score",
    );
  const computedTeamTotal = input.periodScores.reduce(
    (total, value) => total + value,
    0,
  );
  const difference = computedTeamTotal - input.publishedTeamTotal;
  return {
    computedTeamTotal,
    difference,
    reconciles: Math.abs(difference) <= input.tolerance,
  };
};

export const exampleInput = {
  periodScores: [24, 21, 28, 17],
  publishedTeamTotal: 90,
  tolerance: 0,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  periodScores: [1, 2],
  publishedTeamTotal: 4,
  tolerance: 0,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      periodScores: input.periodScores as readonly number[],
      publishedTeamTotal: input.publishedTeamTotal as number,
      tolerance: input.tolerance as number,
    }),
  description: "Reconcile period-level scoring with a published team total.",
  id: "journalism/box-score-reconciliation",
  inputs: [
    { id: "periodScores", label: "Period scores", kind: "numberList" },
    { id: "publishedTeamTotal", label: "Published team total", kind: "number" },
    {
      id: "tolerance",
      label: "Allowed difference",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "computedTeamTotal", label: "Computed team total", kind: "number" },
    { id: "difference", label: "Computed minus published", kind: "number" },
    { id: "reconciles", label: "Reconciles", kind: "boolean" },
  ],
  title: "Box Score Reconciliation",
});

export const run = tool.execute;
export default tool;
