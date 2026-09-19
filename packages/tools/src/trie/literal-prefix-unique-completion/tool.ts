import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ nodesJson: string; prefix: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nodesJson", label: "nodesJson", kind: "string" },
  { id: "prefix", label: "prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.trieNodes(i.nodesJson);
  const r = H.trieCompletions(t, i.prefix);
  return H.finish({
    unique: r.length === 1,
    completion: r.length === 1 ? r[0] : null,
    count: r.length,
  });
};
export const example = {
  input: {
    nodesJson:
      '[{"id": 0, "parent": null, "character": "", "terminal": false}, {"id": 1, "parent": 0, "character": "a", "terminal": true}, {"id": 2, "parent": 1, "character": "b", "terminal": true}, {"id": 3, "parent": 0, "character": "b", "terminal": true}]',
    prefix: "ab",
  },
  output: {
    result: { unique: true, completion: { id: 2, word: "ab" }, count: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/literal-prefix-unique-completion",
  title: "Prefix Trie Unique Completion Check",
  description:
    "Bounded explicit prefix trie with root ID 0, unique sibling UTF-16 code-unit edges and terminal flags; resolve a completion only when exactly one terminal word exists; missing or tied evidence remains null.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
