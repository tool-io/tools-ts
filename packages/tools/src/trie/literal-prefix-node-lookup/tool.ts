import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ nodesJson: string; prefix: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "nodesJson", label: "nodesJson", kind: "string" },
  { id: "prefix", label: "prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.trieNodes(i.nodesJson);
  return H.finish(H.trieLookup(t, i.prefix));
};
export const example = {
  input: {
    nodesJson:
      '[{"id": 0, "parent": null, "character": "", "terminal": false}, {"id": 1, "parent": 0, "character": "a", "terminal": true}, {"id": 2, "parent": 1, "character": "b", "terminal": true}, {"id": 3, "parent": 0, "character": "b", "terminal": true}]',
    prefix: "ab",
  },
  output: { result: { node: 2, matched: 2, missing: null } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Prefix Trie Literal Prefix Node Lookup",
      "prefix tries",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["trie", "prefix tries", "software development"],
    keywords: ["prefix tries", "software development"],
  },
  id: "trie/literal-prefix-node-lookup",
  title: "Prefix Trie Literal Prefix Node Lookup",
  description:
    "Bounded explicit prefix trie with root ID 0, unique sibling UTF-16 code-unit edges and terminal flags; locate an exact literal prefix node, retaining matched code-unit length and missing-edge witness.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          node: { anyOf: [{ type: "number" }, { type: "null" }] },
          matched: { type: "number" },
          missing: { anyOf: [{ type: "string" }, { type: "null" }] },
        },
        required: ["node", "matched", "missing"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
