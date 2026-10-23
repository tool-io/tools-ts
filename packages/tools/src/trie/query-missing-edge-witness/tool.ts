import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ nodesJson: string; query: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "nodesJson", label: "nodesJson", kind: "string" },
  { id: "query", label: "query", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.trieNodes(i.nodesJson);
  const lookup = H.trieLookup(t, i.query);
  return H.finish({
    witness:
      lookup.node === null
        ? {
            position: lookup.matched,
            character: lookup.missing,
            prefix: i.query.slice(0, lookup.matched),
          }
        : null,
  });
};
export const example = {
  input: {
    nodesJson:
      '[{"id": 0, "parent": null, "character": "", "terminal": false}, {"id": 1, "parent": 0, "character": "a", "terminal": true}, {"id": 2, "parent": 1, "character": "b", "terminal": true}, {"id": 3, "parent": 0, "character": "b", "terminal": true}]',
    query: "ac",
  },
  output: { result: { witness: { position: 1, character: "c", prefix: "a" } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Prefix Trie Query Missing Edge Witness",
      "prefix tries",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["trie", "prefix tries", "software development"],
    keywords: ["prefix tries", "software development"],
  },
  id: "trie/query-missing-edge-witness",
  title: "Prefix Trie Query Missing Edge Witness",
  description:
    "Bounded explicit prefix trie with root ID 0, unique sibling UTF-16 code-unit edges and terminal flags; report the first missing literal edge with matched prefix; a fully matched nonterminal path is structurally present, not a missing edge.",
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
          witness: {
            anyOf: [
              {
                type: "object",
                additionalProperties: false,
                properties: {
                  position: { type: "number" },
                  character: { anyOf: [{ type: "string" }, { type: "null" }] },
                  prefix: { type: "string" },
                },
                required: ["position", "character", "prefix"],
              },
              { type: "null" },
            ],
          },
        },
        required: ["witness"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
