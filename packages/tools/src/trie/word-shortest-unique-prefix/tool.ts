import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ nodesJson: string; word: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nodesJson", label: "nodesJson", kind: "string" },
  { id: "word", label: "word", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.trieNodes(i.nodesJson);
  const lookup = H.trieLookup(t, i.word);
  H.check(
    lookup.node !== null && t.find((v) => v.id === lookup.node)!.terminal,
  );
  const prefixes = Array.from({ length: i.word.length + 1 }, (_, j) =>
    i.word.slice(0, j),
  );
  return H.finish({
    prefix: prefixes.find((s) => H.trieCompletions(t, s).length === 1) ?? null,
  });
};
export const example = {
  input: {
    nodesJson:
      '[{"id": 0, "parent": null, "character": "", "terminal": false}, {"id": 1, "parent": 0, "character": "a", "terminal": true}, {"id": 2, "parent": 1, "character": "b", "terminal": true}, {"id": 3, "parent": 0, "character": "b", "terminal": true}]',
    word: "ab",
  },
  output: { result: { prefix: "ab" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/word-shortest-unique-prefix",
  title: "Prefix Trie Word Shortest Unique Prefix",
  description:
    "Bounded explicit prefix trie with root ID 0, unique sibling UTF-16 code-unit edges and terminal flags; find the shortest literal prefix uniquely completing to a stored terminal word; a word that prefixes others may have no unique prefix.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
