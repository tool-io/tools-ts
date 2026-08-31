import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, wordTokens, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly headlineCopy: string;
  readonly targetKeywordPhrase: string;
  readonly callerMaximumFirstKeywordWordIndex: number;
}>;
export type Output = Readonly<{
  readonly firstKeywordStartWordIndex: number;
  readonly keywordPhraseFound: boolean;
  readonly withinCallerFrontLoadPolicy: boolean;
}>;
const inputFields = [
  { id: "headlineCopy", label: "Headline copy", kind: "string" },
  { id: "targetKeywordPhrase", label: "Target keyword phrase", kind: "string" },
  {
    id: "callerMaximumFirstKeywordWordIndex",
    label: "Caller maximum first keyword word index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMaximumFirstKeywordWordIndex, "index", 0, 10000);
  const words = wordTokens(input.headlineCopy),
    phrase = wordTokens(input.targetKeywordPhrase);
  if (!phrase.length || phrase.length > 128)
    simpleError(
      "keyword",
      "Nonempty bounded explicit keyword phrase required.",
    );
  const index = words.findIndex((_, i) =>
    phrase.every((v, j) => words[i + j] === v),
  );
  return {
    firstKeywordStartWordIndex: index,
    keywordPhraseFound: index >= 0,
    withinCallerFrontLoadPolicy:
      index >= 0 && index <= input.callerMaximumFirstKeywordWordIndex,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  headlineCopy: "City council budget vote",
  targetKeywordPhrase: "council budget",
  callerMaximumFirstKeywordWordIndex: 1,
} satisfies Input;
export const exampleOutput = {
  firstKeywordStartWordIndex: 1,
  keywordPhraseFound: true,
  withinCallerFrontLoadPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/seo-headline-front-load-keyword-position-checker",
  title: "SEO Headline Front Load Keyword Position Checker",
  description:
    "Locate exact contiguous case-folded Unicode keyword tokens in actual headline under caller zero-based frontload budget; no substring false matches, search-engine ranking promise or semantic keyword inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstKeywordStartWordIndex",
      label: "First keyword start word index",
      kind: "number",
    },
    {
      id: "keywordPhraseFound",
      label: "Keyword phrase found",
      kind: "boolean",
    },
    {
      id: "withinCallerFrontLoadPolicy",
      label: "Within caller front load policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      headlineCopy: value.headlineCopy as string,
      targetKeywordPhrase: value.targetKeywordPhrase as string,
      callerMaximumFirstKeywordWordIndex:
        value.callerMaximumFirstKeywordWordIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
