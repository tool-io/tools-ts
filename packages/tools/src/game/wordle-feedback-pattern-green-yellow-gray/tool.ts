import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, feedback } from "../shared.js";
export type Input = Readonly<{
  readonly answerWord: string;
  readonly guessWord: string;
}>;
export type Output = Readonly<{
  readonly feedbackCodes: readonly number[];
  readonly feedbackPattern: string;
}>;
const inputFields = [
  { id: "answerWord", label: "Answer word", kind: "string" },
  { id: "guessWord", label: "Guess word", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !/^[a-z]{1,32}$(?![\s\S])/.test(input.answerWord) ||
    !/^[a-z]{1,32}$(?![\s\S])/.test(input.guessWord)
  )
    simpleError(
      "word",
      "Exact lowercase ASCII words of 1–32 letters required.",
    );
  const f = feedback([...input.answerWord], [...input.guessWord]);
  return { feedbackCodes: f, feedbackPattern: f.join("") };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  answerWord: "apple",
  guessWord: "alley",
} satisfies Input;
export const exampleOutput = {
  feedbackCodes: [2, 1, 0, 1, 0],
  feedbackPattern: "21010",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/wordle-feedback-pattern-green-yellow-gray",
  title: "Wordle Green/Yellow/Gray Feedback Pattern",
  description:
    "Compute exact green=2/yellow=1/gray=0 Wordle feedback with green-first multiset duplicate accounting, not membership-only matching; no dictionary guessing or word-length-five assumption.",
  inputs: inputFields,
  outputs: [
    { id: "feedbackCodes", label: "Feedback codes", kind: "numberList" },
    { id: "feedbackPattern", label: "Feedback pattern", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      answerWord: value.answerWord as string,
      guessWord: value.guessWord as string,
    }),
});
export const run = tool.execute;
export default tool;
