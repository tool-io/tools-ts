import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, at, textBound } from "../batch-shared.js";
export type Input = Readonly<{ readonly plainSpanishText: string }>;
export type Output = Readonly<{
  readonly matchedInvertedPunctuationPairCount: number;
  readonly unmatchedOpeningCodePointIndices: readonly number[];
  readonly unmatchedClosingCodePointIndices: readonly number[];
  readonly observedInvertedPairsBalanced: boolean;
}>;
const inputFields = [
  { id: "plainSpanishText", label: "Plain spanish text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  textBound(input.plainSpanishText);
  const stack: { mark: string; index: number }[] = [],
    close: number[] = [];
  let matched = 0;
  [...input.plainSpanishText].forEach((c, i) => {
    if (c === "¿" || c === "¡") stack.push({ mark: c, index: i });
    else if (c === "?" || c === "!") {
      if (stack.at(-1)?.mark === (c === "?" ? "¿" : "¡")) {
        stack.pop();
        matched++;
      } else close.push(i);
    }
  });
  return {
    matchedInvertedPunctuationPairCount: matched,
    unmatchedOpeningCodePointIndices: stack.map((v) => v.index),
    unmatchedClosingCodePointIndices: close,
    observedInvertedPairsBalanced: stack.length === 0 && close.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { plainSpanishText: "¿Qué? ¡Sí!" } satisfies Input;
export const exampleOutput = {
  matchedInvertedPunctuationPairCount: 2,
  unmatchedOpeningCodePointIndices: [],
  unmatchedClosingCodePointIndices: [],
  observedInvertedPairsBalanced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/spanish-inverted-punctuation-placement",
  title: "Spanish Inverted Punctuation Placement Rule",
  description:
    "Audit actual properly nested Spanish inverted/closing question and exclamation marks with source code-point indices; matching is structural only, not a claim about where a grammatical interrogative begins or missing punctuation in unmarked prose.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedInvertedPunctuationPairCount",
      label: "Matched inverted punctuation pair count",
      kind: "number",
    },
    {
      id: "unmatchedOpeningCodePointIndices",
      label: "Unmatched opening code point indices",
      kind: "numberList",
    },
    {
      id: "unmatchedClosingCodePointIndices",
      label: "Unmatched closing code point indices",
      kind: "numberList",
    },
    {
      id: "observedInvertedPairsBalanced",
      label: "Observed inverted pairs balanced",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ plainSpanishText: value.plainSpanishText as string }),
});
export const run = tool.execute;
export default tool;
