import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedPaperbackTextWordCounts: readonly number[];
  readonly observedCorrespondingTextPageCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledObservedWordsPerTextPage: number;
}>;
const inputFields = [
  {
    id: "observedPaperbackTextWordCounts",
    label: "Observed paperback text word counts",
    kind: "numberList",
  },
  {
    id: "observedCorrespondingTextPageCounts",
    label: "Observed corresponding text page counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCorrespondingTextPageCounts.forEach((v) =>
    positive(v, "observedCorrespondingTextPageCounts"),
  );
  input.observedPaperbackTextWordCounts.forEach((v) =>
    nonnegative(v, "observedPaperbackTextWordCounts"),
  );
  aligned(
    input.observedPaperbackTextWordCounts,
    input.observedCorrespondingTextPageCounts,
    "observedPaperbackTextWordCounts",
  );
  [
    ...input.observedPaperbackTextWordCounts,
    ...input.observedCorrespondingTextPageCounts,
  ].forEach((v) => integer(v, "inventory"));
  return {
    pooledObservedWordsPerTextPage:
      sum(input.observedPaperbackTextWordCounts) /
      sum(input.observedCorrespondingTextPageCounts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPaperbackTextWordCounts: [100, 300],
  observedCorrespondingTextPageCounts: [1, 2],
} satisfies Input;
export const exampleOutput = {
  pooledObservedWordsPerTextPage: 133.33333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/words-per-page-trade-paperback",
  title: "Words Per Page Trade Paperback Lookup",
  description:
    "Actual matched trade-paperback word/page calibration pooled by page exposure, not sample means or fixed industry density. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledObservedWordsPerTextPage",
      label: "Pooled observed words per text page",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPaperbackTextWordCounts:
        value.observedPaperbackTextWordCounts as readonly number[],
      observedCorrespondingTextPageCounts:
        value.observedCorrespondingTextPageCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
