import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly questionScores: readonly number[];
  readonly maximumQuestionScore: number;
  readonly minimumPercent: number;
}>;
export type Output = Readonly<{
  readonly averageScore: number;
  readonly evaluationPercent: number;
  readonly belowMaximumCount: number;
  readonly meetsMinimum: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.questionScores.length === 0 ||
    input.maximumQuestionScore <= 0 ||
    input.questionScores.some(
      (value) => value < 0 || value > input.maximumQuestionScore,
    )
  )
    simpleError(
      "questionScores",
      "Scores must be nonempty and within the supplied maximum.",
      "invalid_scores",
    );
  const averageScore =
      input.questionScores.reduce((a, b) => a + b, 0) /
      input.questionScores.length,
    evaluationPercent = (averageScore / input.maximumQuestionScore) * 100;
  return {
    averageScore,
    evaluationPercent,
    belowMaximumCount: input.questionScores.filter(
      (value) => value < input.maximumQuestionScore,
    ).length,
    meetsMinimum: evaluationPercent >= input.minimumPercent,
  };
};

export const exampleInput = {
  questionScores: [4, 5, 3, 4],
  maximumQuestionScore: 5,
  minimumPercent: 75,
} satisfies Input;
export const exampleOutput = {
  averageScore: 4,
  evaluationPercent: 80,
  belowMaximumCount: 3,
  meetsMinimum: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      questionScores: input.questionScores as readonly number[],
      maximumQuestionScore: input.maximumQuestionScore as number,
      minimumPercent: input.minimumPercent as number,
    }),
  description:
    "Score an audit-committee self-evaluation against a supplied minimum.",
  id: "auditing/committee-self-evaluation",
  inputs: [
    {
      id: "questionScores",
      label: "Self-evaluation question scores",
      kind: "numberList",
    },
    {
      id: "maximumQuestionScore",
      label: "Maximum score per question",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumPercent",
      label: "Minimum evaluation percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "averageScore",
      label: "Average question score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "evaluationPercent",
      label: "Evaluation percentage",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "belowMaximumCount",
      label: "Questions below maximum",
      kind: "integer",
      minimum: 0,
    },
    { id: "meetsMinimum", label: "Meets supplied minimum", kind: "boolean" },
  ],
  title: "Committee Self-Evaluation",
});

export const run = tool.execute;
export default tool;
