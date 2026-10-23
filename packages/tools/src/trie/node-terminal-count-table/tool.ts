import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ nodesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "nodesJson", label: "nodesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.trieNodes(i.nodesJson);
  return H.finish({
    counts: t.map((v) => ({
      id: v.id,
      count: H.trieCompletions(t, H.trieWord(t, v.id)).length,
    })),
  });
};
export const example = {
  input: {
    nodesJson:
      '[{"id": 0, "parent": null, "character": "", "terminal": false}, {"id": 1, "parent": 0, "character": "a", "terminal": true}, {"id": 2, "parent": 1, "character": "b", "terminal": true}, {"id": 3, "parent": 0, "character": "b", "terminal": true}]',
  },
  output: {
    result: {
      counts: [
        { id: 0, count: 3 },
        { id: 1, count: 2 },
        { id: 2, count: 1 },
        { id: 3, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Prefix Trie Node Terminal Count Table",
      "prefix tries",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["trie", "prefix tries", "software development"],
    keywords: ["prefix tries", "software development"],
  },
  id: "trie/node-terminal-count-table",
  title: "Prefix Trie Node Terminal Count Table",
  description:
    "Bounded explicit prefix trie with root ID 0, unique sibling UTF-16 code-unit edges and terminal flags; count terminal descendants including self at every node; trie terminals are distinct words, not observation counts.",
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
          counts: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { id: { type: "number" }, count: { type: "number" } },
              required: ["id", "count"],
            },
          },
        },
        required: ["counts"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
