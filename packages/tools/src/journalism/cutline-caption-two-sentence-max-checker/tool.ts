import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerAnnotatedCaptionSentences: readonly string[];
  readonly callerMaximumCaptionSentences: number;
}>;
export type Output = Readonly<{
  readonly observedCaptionSentenceCount: number;
  readonly emptyAnnotatedSentenceIndices: readonly number[];
  readonly withinCallerCaptionSentencePolicy: boolean;
}>;
const inputFields = [
  {
    id: "callerAnnotatedCaptionSentences",
    label: "Caller annotated caption sentences",
    kind: "stringList",
  },
  {
    id: "callerMaximumCaptionSentences",
    label: "Caller maximum caption sentences",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMaximumCaptionSentences, "limit", 1, 20);
  const empty = input.callerAnnotatedCaptionSentences.flatMap((s, i) =>
    !s.trim() ? [i] : [],
  );
  return {
    observedCaptionSentenceCount: input.callerAnnotatedCaptionSentences.length,
    emptyAnnotatedSentenceIndices: empty,
    withinCallerCaptionSentencePolicy:
      empty.length === 0 &&
      input.callerAnnotatedCaptionSentences.length > 0 &&
      input.callerAnnotatedCaptionSentences.length <=
        input.callerMaximumCaptionSentences,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnotatedCaptionSentences: ["A person waits.", "The bus arrives."],
  callerMaximumCaptionSentences: 2,
} satisfies Input;
export const exampleOutput = {
  observedCaptionSentenceCount: 2,
  emptyAnnotatedSentenceIndices: [],
  withinCallerCaptionSentencePolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/cutline-caption-two-sentence-max-checker",
  title: "Cutline Caption Two Sentence Max Checker",
  description:
    "Audit actual caller annotated caption sentence segments and empties against explicit sentence count policy; no naive splitting on abbreviations/decimal punctuation, fact accuracy, universal two-sentence rule or photo interpretation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCaptionSentenceCount",
      label: "Observed caption sentence count",
      kind: "number",
    },
    {
      id: "emptyAnnotatedSentenceIndices",
      label: "Empty annotated sentence indices",
      kind: "numberList",
    },
    {
      id: "withinCallerCaptionSentencePolicy",
      label: "Within caller caption sentence policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnotatedCaptionSentences:
        value.callerAnnotatedCaptionSentences as readonly string[],
      callerMaximumCaptionSentences:
        value.callerMaximumCaptionSentences as number,
    }),
});
export const run = tool.execute;
export default tool;
