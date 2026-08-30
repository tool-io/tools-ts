import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly testScores: readonly number[];
  readonly followupCutoff: number;
}>;
export type Output = Readonly<{
  readonly totalScore: number;
  readonly lowestTestScore: number;
  readonly belowCutoff: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.testScores.length !== 7 ||
    input.testScores.some((v) => !Number.isSafeInteger(v) || v < 0 || v > 3) ||
    !Number.isSafeInteger(input.followupCutoff) ||
    input.followupCutoff < 0 ||
    input.followupCutoff > 21
  )
    simpleError(
      "testScores",
      "Exactly seven FMS item scores from zero to three and a valid cutoff required.",
    );
  const totalScore = input.testScores.reduce((a, b) => a + b, 0);
  return {
    totalScore,
    lowestTestScore: Math.min(...input.testScores),
    belowCutoff: totalScore < input.followupCutoff,
  };
};
export const exampleInput = {
  testScores: [2, 2, 2, 2, 2, 2, 2],
  followupCutoff: 14,
} satisfies Input;
export const exampleOutput = {
  totalScore: 14,
  lowestTestScore: 2,
  belowCutoff: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/fms-seven-item-score",
  title: "FMS Seven Item Score",
  description:
    "Sum seven Functional Movement Screen scores; compare only with supplied cutoff.",
  inputs: [
    { id: "testScores", label: "Test scores", kind: "numberList" },
    { id: "followupCutoff", label: "Followup cutoff", kind: "number" },
  ],
  outputs: [
    { id: "totalScore", label: "Total score", kind: "number" },
    { id: "lowestTestScore", label: "Lowest test score", kind: "number" },
    { id: "belowCutoff", label: "Below cutoff", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      testScores: value.testScores as readonly number[],
      followupCutoff: value.followupCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
