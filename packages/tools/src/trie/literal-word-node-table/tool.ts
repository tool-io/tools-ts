import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ words: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "words", label: "words", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ nodes: H.makeTrie(i.words) });
};
export const example = {
  input: { words: ["a", "ab", "b"] },
  output: {
    result: {
      nodes: [
        { id: 0, parent: null, character: "", terminal: false },
        { id: 1, parent: 0, character: "a", terminal: true },
        { id: 2, parent: 1, character: "b", terminal: true },
        { id: 3, parent: 0, character: "b", terminal: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/literal-word-node-table",
  title: "Literal Word Trie Node Table",
  description:
    "Construct a literal UTF-16-code-unit trie with stable insertion IDs and at most 128 nodes; repeated words share one terminal, empty words terminate the root.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
