import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  words: readonly string[];
  weights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "words", label: "words", kind: "stringList" },
  { id: "weights", label: "weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.words.length === i.weights.length);
  H.nonnegative(i.weights);
  return H.finish({
    totals: H.groups(i.words, (x) => x).map((g) => ({
      word: g.key,
      weight: g.indexes.reduce((s, j) => s + i.weights[j], 0),
      indexes: g.indexes,
    })),
  });
};
export const example = {
  input: { words: ["a", "ab", "a"], weights: [1, 2, 3] },
  output: {
    result: {
      totals: [
        { word: "a", weight: 4, indexes: [0, 2] },
        { word: "ab", weight: 2, indexes: [1] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/terminal-word-weight-totals",
  title: "Prefix Trie Terminal Word Weight Totals",
  description:
    "Aggregate nonnegative supplied word occurrence weights before trie completion scoring; exact literal word identity, no inferred corpus frequency.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
