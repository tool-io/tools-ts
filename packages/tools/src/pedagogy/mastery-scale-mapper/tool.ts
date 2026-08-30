import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly score: number;
  readonly minimumScores: readonly number[];
  readonly levelLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly level: string;
  readonly distanceToNext: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.minimumScores.length;
  if (
    !n ||
    n !== input.levelLabels.length ||
    input.minimumScores.some(
      (v, i) => i > 0 && v <= input.minimumScores[i - 1],
    ) ||
    new Set(input.levelLabels).size !== n
  )
    simpleError(
      "minimumScores",
      "Ordered distinct mastery cutoffs and level labels required.",
    );
  let index = -1;
  for (let i = 0; i < n; i++)
    if (input.score >= input.minimumScores[i]) index = i;
  if (index < 0)
    simpleError("score", "Score lies below the lowest mapped mastery level.");
  return {
    level: input.levelLabels[index],
    distanceToNext:
      index === n - 1 ? 0 : input.minimumScores[index + 1] - input.score,
  };
};
export const exampleInput = {
  score: 82,
  minimumScores: [0, 60, 80],
  levelLabels: ["beginning", "developing", "mastered"],
} satisfies Input;
export const exampleOutput = {
  level: "mastered",
  distanceToNext: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/mastery-scale-mapper",
  title: "Mastery Scale Mapper",
  description:
    "Map an assessment score onto a caller-defined standards-based mastery scale.",
  inputs: [
    { id: "score", label: "Score", kind: "number" },
    { id: "minimumScores", label: "Minimum scores", kind: "numberList" },
    { id: "levelLabels", label: "Level labels", kind: "stringList" },
  ],
  outputs: [
    { id: "level", label: "Level", kind: "string" },
    { id: "distanceToNext", label: "Distance to next", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      score: value.score as number,
      minimumScores: value.minimumScores as readonly number[],
      levelLabels: value.levelLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
