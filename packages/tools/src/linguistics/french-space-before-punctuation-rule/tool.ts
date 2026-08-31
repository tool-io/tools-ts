import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, textBound } from "../batch-shared.js";
export type Input = Readonly<{
  readonly plainProseText: string;
  readonly callerSemicolonQuestionExclamationSpace: string;
  readonly callerColonSpace: string;
}>;
export type Output = Readonly<{
  readonly textWithCallerFrenchPunctuationSpacing: string;
  readonly changedPunctuationSourceUtf16Indices: readonly number[];
}>;
const inputFields = [
  { id: "plainProseText", label: "Plain prose text", kind: "string" },
  {
    id: "callerSemicolonQuestionExclamationSpace",
    label: "Caller semicolon question exclamation space",
    kind: "string",
  },
  { id: "callerColonSpace", label: "Caller colon space", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  textBound(input.plainProseText);
  if (
    ![" ", " ", " "].includes(input.callerSemicolonQuestionExclamationSpace) ||
    ![" ", " ", " "].includes(input.callerColonSpace)
  )
    simpleError(
      "space",
      "Explicit ordinary/nonbreaking/narrow-nonbreaking single space required.",
    );
  const changed: number[] = [];
  const out = input.plainProseText.replace(
    /([   ]*)([;!?:])/g,
    (match, spaces: string, p: string, offset: number) => {
      if (offset === 0 || input.plainProseText[offset - 1] === "\n")
        return match;
      const wanted =
        p === ":"
          ? input.callerColonSpace
          : input.callerSemicolonQuestionExclamationSpace;
      if (spaces !== wanted) changed.push(offset + spaces.length);
      return wanted + p;
    },
  );
  return {
    textWithCallerFrenchPunctuationSpacing: out,
    changedPunctuationSourceUtf16Indices: changed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plainProseText: "Salut ! oui:non",
  callerSemicolonQuestionExclamationSpace: " ",
  callerColonSpace: " ",
} satisfies Input;
export const exampleOutput = {
  textWithCallerFrenchPunctuationSpacing: "Salut ! oui :non",
  changedPunctuationSourceUtf16Indices: [6, 11],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/french-space-before-punctuation-rule",
  title: "French Space-Before-Punctuation Rule",
  description:
    "Normalize internal plain-prose spacing before French semicolon/question/exclamation/colon using explicit caller regional typographic choices, preserving start-of-line marks; not safe for URLs/code or a universal language-wide spacing rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "textWithCallerFrenchPunctuationSpacing",
      label: "Text with caller french punctuation spacing",
      kind: "string",
    },
    {
      id: "changedPunctuationSourceUtf16Indices",
      label: "Changed punctuation source utf16 indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      plainProseText: value.plainProseText as string,
      callerSemicolonQuestionExclamationSpace:
        value.callerSemicolonQuestionExclamationSpace as string,
      callerColonSpace: value.callerColonSpace as string,
    }),
});
export const run = tool.execute;
export default tool;
