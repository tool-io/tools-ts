import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  sumMoney,
  nonnegative,
  positive,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly questionWordCounts: readonly number[];
  readonly answerWordCounts: readonly number[];
  readonly audioDurationMinutes: number;
  readonly observedNonSpeechMinutes: number;
}>;
export type Output = Readonly<{
  readonly questionWordShareFraction: number;
  readonly answerWordShareFraction: number;
  readonly transcriptWordsPerElapsedMinute: number;
  readonly transcriptWordsPerObservedSpeechMinute: number;
}>;
const inputFields = [
  {
    id: "questionWordCounts",
    label: "Question word counts",
    kind: "numberList",
  },
  { id: "answerWordCounts", label: "Answer word counts", kind: "numberList" },
  {
    id: "audioDurationMinutes",
    label: "Audio duration minutes",
    kind: "number",
  },
  {
    id: "observedNonSpeechMinutes",
    label: "Observed non speech minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.audioDurationMinutes, "audioDurationMinutes");
  nonnegative(input.observedNonSpeechMinutes, "observedNonSpeechMinutes");
  input.questionWordCounts.forEach((v) => integer(v, "questionWordCounts"));
  input.answerWordCounts.forEach((v) => integer(v, "answerWordCounts"));
  aligned(
    input.questionWordCounts,
    input.answerWordCounts,
    "questionWordCounts",
  );
  [...input.questionWordCounts, ...input.answerWordCounts].forEach((v) =>
    nonnegative(v, "words"),
  );
  if (input.observedNonSpeechMinutes >= input.audioDurationMinutes)
    simpleError("speech", "Positive observed speech minutes required.");
  const q = sumMoney(input.questionWordCounts),
    a = sumMoney(input.answerWordCounts),
    total = positive(q + a, "words");
  return {
    questionWordShareFraction: q / total,
    answerWordShareFraction: a / total,
    transcriptWordsPerElapsedMinute: total / input.audioDurationMinutes,
    transcriptWordsPerObservedSpeechMinute:
      total / (input.audioDurationMinutes - input.observedNonSpeechMinutes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  questionWordCounts: [10, 20],
  answerWordCounts: [30, 40],
  audioDurationMinutes: 2,
  observedNonSpeechMinutes: 0.5,
} satisfies Input;
export const exampleOutput = {
  questionWordShareFraction: 0.3,
  answerWordShareFraction: 0.7,
  transcriptWordsPerElapsedMinute: 50,
  transcriptWordsPerObservedSpeechMinute: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/q-and-a-transcript-word-to-minute-ratio",
  title: "Q and a Transcript Word to Minute Ratio",
  description:
    "Audit actual Q&A word allocation and elapsed-versus-observed-speech rates using explicit non-speech duration; no invented pause count, productivity standard or automatic speaker/word annotation.",
  inputs: inputFields,
  outputs: [
    {
      id: "questionWordShareFraction",
      label: "Question word share fraction",
      kind: "number",
    },
    {
      id: "answerWordShareFraction",
      label: "Answer word share fraction",
      kind: "number",
    },
    {
      id: "transcriptWordsPerElapsedMinute",
      label: "Transcript words per elapsed minute",
      kind: "number",
    },
    {
      id: "transcriptWordsPerObservedSpeechMinute",
      label: "Transcript words per observed speech minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      questionWordCounts: value.questionWordCounts as readonly number[],
      answerWordCounts: value.answerWordCounts as readonly number[],
      audioDurationMinutes: value.audioDurationMinutes as number,
      observedNonSpeechMinutes: value.observedNonSpeechMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
