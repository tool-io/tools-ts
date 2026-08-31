import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedInterviewMinutes: number;
  readonly completedTranscriptWordCount: number;
  readonly callerWordsPerTranscriptPage: number;
}>;
export type Output = Readonly<{
  readonly completedTranscriptPageEquivalent: number;
  readonly observedInterviewMinutesPerPage: number;
  readonly observedTranscriptWordsPerAudioMinute: number;
}>;
const inputFields = [
  {
    id: "observedInterviewMinutes",
    label: "Observed interview minutes",
    kind: "number",
  },
  {
    id: "completedTranscriptWordCount",
    label: "Completed transcript word count",
    kind: "number",
  },
  {
    id: "callerWordsPerTranscriptPage",
    label: "Caller words per transcript page",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedInterviewMinutes, "observedInterviewMinutes");
  bounded(input.completedTranscriptWordCount, "words", 1, 10000000);
  bounded(input.callerWordsPerTranscriptPage, "pageWords", 1, 100000);
  const pages =
    input.completedTranscriptWordCount / input.callerWordsPerTranscriptPage;
  return {
    completedTranscriptPageEquivalent: pages,
    observedInterviewMinutesPerPage: input.observedInterviewMinutes / pages,
    observedTranscriptWordsPerAudioMinute:
      input.completedTranscriptWordCount / input.observedInterviewMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInterviewMinutes: 10,
  completedTranscriptWordCount: 1000,
  callerWordsPerTranscriptPage: 250,
} satisfies Input;
export const exampleOutput = {
  completedTranscriptPageEquivalent: 4,
  observedInterviewMinutesPerPage: 2.5,
  observedTranscriptWordsPerAudioMinute: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/interview-minutes-per-transcribed-page-estimate",
  title: "Interview Minutes per Transcribed Page Estimate",
  description:
    "Calibrate actual interview audio minutes against completed transcript words and caller page word density; this observed ratio is not universal transcription productivity or a speech recognition accuracy assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "completedTranscriptPageEquivalent",
      label: "Completed transcript page equivalent",
      kind: "number",
    },
    {
      id: "observedInterviewMinutesPerPage",
      label: "Observed interview minutes per page",
      kind: "number",
    },
    {
      id: "observedTranscriptWordsPerAudioMinute",
      label: "Observed transcript words per audio minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInterviewMinutes: value.observedInterviewMinutes as number,
      completedTranscriptWordCount:
        value.completedTranscriptWordCount as number,
      callerWordsPerTranscriptPage:
        value.callerWordsPerTranscriptPage as number,
    }),
});
export const run = tool.execute;
export default tool;
