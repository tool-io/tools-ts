import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ transitionsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  return H.finish({
    duplicates: H.duplicates(t, (v) => JSON.stringify([v.from, v.symbol])),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
  },
  output: { result: { duplicates: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Deterministic Transition Key Audit"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/deterministic-transition-key-audit",
  title: "DFA Deterministic Transition Key Audit",
  description:
    "Audit repeated deterministic automaton source-state/symbol keys, including identical repeated targets; no silent first/last transition selection.",
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
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["duplicates"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
