import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly solutionSteps: number;
  readonly practiceProblems: number;
}>;
export type Output = Readonly<{
  readonly providedStepCounts: readonly number[];
  readonly independentProblemCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.solutionSteps) ||
    input.solutionSteps < 1 ||
    !Number.isSafeInteger(input.practiceProblems) ||
    input.practiceProblems < 1
  )
    simpleError(
      "solutionSteps",
      "Positive whole-number solution steps and practice problems required.",
    );
  const providedStepCounts = Array.from(
    { length: input.practiceProblems },
    (_, i) => Math.max(0, input.solutionSteps - i),
  );
  return {
    providedStepCounts,
    independentProblemCount: providedStepCounts.filter((v) => v === 0).length,
  };
};
export const exampleInput = {
  solutionSteps: 4,
  practiceProblems: 5,
} satisfies Input;
export const exampleOutput = {
  providedStepCounts: [4, 3, 2, 1, 0],
  independentProblemCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/worked-example-fading",
  title: "Worked Example Fading",
  description:
    "Plan a stepwise fade from fully worked examples to independent solutions.",
  inputs: [
    { id: "solutionSteps", label: "Solution steps", kind: "number" },
    { id: "practiceProblems", label: "Practice problems", kind: "number" },
  ],
  outputs: [
    {
      id: "providedStepCounts",
      label: "Provided step counts",
      kind: "numberList",
    },
    {
      id: "independentProblemCount",
      label: "Independent problem count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      solutionSteps: value.solutionSteps as number,
      practiceProblems: value.practiceProblems as number,
    }),
});
export const run = tool.execute;
export default tool;
