import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  words: readonly string[];
  scores: readonly number[];
  prefix: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "words", label: "words", kind: "stringList" },
  { id: "scores", label: "scores", kind: "numberList" },
  { id: "prefix", label: "prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.words.length === i.scores.length);
  return H.finish({
    completions: i.words
      .map((word, index) => ({ word, score: i.scores[index], index }))
      .filter((v) => v.word.startsWith(i.prefix))
      .sort((a, b) => b.score - a.score || a.index - b.index),
  });
};
export const example = {
  input: { words: ["ab", "a", "b"], scores: [1, 2, 3], prefix: "a" },
  output: {
    result: {
      completions: [
        { word: "a", score: 2, index: 1 },
        { word: "ab", score: 1, index: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/completion-explicit-score-order",
  title: "Prefix Trie Completion Explicit Score Order",
  description:
    "Order explicit scored prefix completions by descending score with stable source ties, retaining distinct occurrence IDs; no authoritative autocomplete dictionary.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
