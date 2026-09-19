import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ nodesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nodesJson", label: "nodesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.trieNodes(i.nodesJson);
  return H.finish({
    nodes: t.map((v) => {
      const children = t.filter((x) => x.parent === v.id).length;
      return {
        id: v.id,
        terminal: v.terminal,
        children,
        kind: children === 0 ? "leaf" : children === 1 ? "unary" : "branch",
      };
    }),
  });
};
export const example = {
  input: {
    nodesJson:
      '[{"id": 0, "parent": null, "character": "", "terminal": false}, {"id": 1, "parent": 0, "character": "a", "terminal": true}, {"id": 2, "parent": 1, "character": "b", "terminal": true}, {"id": 3, "parent": 0, "character": "b", "terminal": true}]',
  },
  output: {
    result: {
      nodes: [
        { id: 0, terminal: false, children: 2, kind: "branch" },
        { id: 1, terminal: true, children: 1, kind: "unary" },
        { id: 2, terminal: true, children: 0, kind: "leaf" },
        { id: 3, terminal: true, children: 0, kind: "leaf" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/node-leaf-branch-classification",
  title: "Prefix Trie Leaf Branch Classification",
  description:
    "Bounded explicit prefix trie with root ID 0, unique sibling UTF-16 code-unit edges and terminal flags; classify structural leaf/unary/branch independently of terminal membership, preserving all nodes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
