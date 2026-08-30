import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly activities: readonly number[];
  readonly contacts: readonly number[];
  readonly targetIndex: number;
}>;
export type Output = Readonly<{
  readonly abcScores: readonly number[];
  readonly targetRank: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.activities.length;
  if (n === 0 || input.contacts.length !== n || input.targetIndex >= n)
    simpleError(
      "activities",
      "Aligned scores and valid target index are required.",
      "invalid_scores",
    );
  const raw = input.activities.map((v, i) => v * input.contacts[i]),
    total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError("activities", "Total score must be positive.", "zero_score");
  const abcScores = raw.map((v) => v / total),
    targetRank =
      [...abcScores]
        .sort((a, b) => b - a)
        .indexOf(abcScores[input.targetIndex]) + 1;
  return { abcScores, targetRank };
};

export const exampleInput = {
  activities: [1, 2, 1],
  contacts: [1, 1, 3],
  targetIndex: 2,
} satisfies Input;
export const exampleOutput = {
  abcScores: [0.16666666666666666, 0.3333333333333333, 0.5],
  targetRank: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      activities: input.activities as readonly number[],
      contacts: input.contacts as readonly number[],
      targetIndex: input.targetIndex as number,
    }),
  description: "Rank enhancer-gene links by activity-by-contact score.",
  id: "epigenetics/abc-linkage-rank",
  inputs: [
    { id: "activities", label: "Enhancer activities", kind: "numberList" },
    { id: "contacts", label: "Enhancer contacts", kind: "numberList" },
    { id: "targetIndex", label: "Target index", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "abcScores", label: "Normalized ABC scores", kind: "numberList" },
    { id: "targetRank", label: "Target rank", kind: "integer", minimum: 1 },
  ],
  title: "ABC Linkage Rank",
});

export const run = tool.execute;
export default tool;
