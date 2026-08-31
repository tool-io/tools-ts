import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  countWords,
  bounded,
  codepoints,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly headline: string;
  readonly deckText: string;
  readonly callerMaximumDeckWords: number;
  readonly callerMaximumDeckCharacters: number;
}>;
export type Output = Readonly<{
  readonly deckWordCount: number;
  readonly deckCodepointCount: number;
  readonly duplicatesHeadlineExactly: boolean;
  readonly withinCallerDeckLimits: boolean;
}>;
const inputFields = [
  { id: "headline", label: "Headline", kind: "string" },
  { id: "deckText", label: "Deck text", kind: "string" },
  {
    id: "callerMaximumDeckWords",
    label: "Caller maximum deck words",
    kind: "number",
  },
  {
    id: "callerMaximumDeckCharacters",
    label: "Caller maximum deck characters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerMaximumDeckWords, "wordLimit", 1, 1000);
  bounded(input.callerMaximumDeckCharacters, "charLimit", 1, 65536);
  const words = countWords(input.deckText),
    chars = codepoints(input.deckText).length,
    duplicate =
      input.deckText.trim().toLocaleLowerCase("en-US") ===
      input.headline.trim().toLocaleLowerCase("en-US");
  return {
    deckWordCount: words,
    deckCodepointCount: chars,
    duplicatesHeadlineExactly: duplicate,
    withinCallerDeckLimits:
      words <= input.callerMaximumDeckWords &&
      chars <= input.callerMaximumDeckCharacters &&
      !duplicate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  headline: "Budget vote",
  deckText: "Council meets today.",
  callerMaximumDeckWords: 4,
  callerMaximumDeckCharacters: 30,
} satisfies Input;
export const exampleOutput = {
  deckWordCount: 3,
  deckCodepointCount: 20,
  duplicatesHeadlineExactly: false,
  withinCallerDeckLimits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/deck-subhead-length-guideline-checker",
  title: "Deck Subhead Length Guideline Checker",
  description:
    "Audit actual deck text against caller word/codepoint budgets and exact headline duplication, not a universal editorial guideline, grapheme/display width, semantic redundancy or lower-third line fit.",
  inputs: inputFields,
  outputs: [
    { id: "deckWordCount", label: "Deck word count", kind: "number" },
    { id: "deckCodepointCount", label: "Deck codepoint count", kind: "number" },
    {
      id: "duplicatesHeadlineExactly",
      label: "Duplicates headline exactly",
      kind: "boolean",
    },
    {
      id: "withinCallerDeckLimits",
      label: "Within caller deck limits",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      headline: value.headline as string,
      deckText: value.deckText as string,
      callerMaximumDeckWords: value.callerMaximumDeckWords as number,
      callerMaximumDeckCharacters: value.callerMaximumDeckCharacters as number,
    }),
});
export const run = tool.execute;
export default tool;
