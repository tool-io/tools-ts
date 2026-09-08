import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  integer,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedWordCount: number;
  readonly callerWordsPerTextPage: number;
  readonly callerNonTextPageAllowance: number;
}>;
export type Output = Readonly<{
  readonly wholeProjectedPageCount: number;
  readonly lastTextPageWords: number;
}>;
const inputFields = [
  { id: "observedWordCount", label: "Observed word count", kind: "number" },
  {
    id: "callerWordsPerTextPage",
    label: "Caller words per text page",
    kind: "number",
  },
  {
    id: "callerNonTextPageAllowance",
    label: "Caller non text page allowance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWordsPerTextPage, "callerWordsPerTextPage");
  nonnegative(input.observedWordCount, "observedWordCount");
  integer(input.observedWordCount, "words");
  integer(input.callerWordsPerTextPage, "words/page");
  bounded(input.callerNonTextPageAllowance, "front/backmatter", 0, 10000);
  const n = integer(
    Math.ceil(input.observedWordCount / input.callerWordsPerTextPage),
    "pages",
  );
  return {
    wholeProjectedPageCount: integer(
      n + input.callerNonTextPageAllowance,
      "totalpages",
    ),
    lastTextPageWords: n
      ? input.observedWordCount - (n - 1) * input.callerWordsPerTextPage
      : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWordCount: 501,
  callerWordsPerTextPage: 250,
  callerNonTextPageAllowance: 2,
} satisfies Input;
export const exampleOutput = {
  wholeProjectedPageCount: 5,
  lastTextPageWords: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/page-count-from-wordcount-standard",
  title: "Page Count From Word Count Standard",
  description:
    "Caller explicit text capacity plus separate non text page budget, whole pages and final partial page load retained; not actual typeset page count or fixed 250 standard. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "wholeProjectedPageCount",
      label: "Whole projected page count",
      kind: "number",
    },
    { id: "lastTextPageWords", label: "Last text page words", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedWordCount: value.observedWordCount as number,
      callerWordsPerTextPage: value.callerWordsPerTextPage as number,
      callerNonTextPageAllowance: value.callerNonTextPageAllowance as number,
    }),
});
export const run = tool.execute;
export default tool;
