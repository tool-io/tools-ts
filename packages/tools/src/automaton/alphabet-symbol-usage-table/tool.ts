import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  states: readonly string[];
  alphabet: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "states", label: "states", kind: "stringList" },
  { id: "alphabet", label: "alphabet", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.dfa(i.states, i.alphabet, t);
  return H.finish({
    symbols: i.alphabet.map((symbol) => ({
      symbol,
      indexes: t.flatMap((v, j) => (v.symbol === symbol ? [j] : [])),
      sourceStates: H.unique(
        t.filter((v) => v.symbol === symbol).map((v) => v.from),
      ),
    })),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a", "b", "c"],
    alphabet: ["x"],
  },
  output: {
    result: {
      symbols: [{ symbol: "x", indexes: [0, 1], sourceStates: ["a", "b"] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Alphabet Symbol Usage Table"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/alphabet-symbol-usage-table",
  title: "DFA Alphabet Symbol Usage Table",
  description:
    "Inventory declared alphabet usage across deterministic transition occurrences and distinct source states, including unused symbols with empty evidence.",
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
          symbols: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                symbol: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
                sourceStates: { type: "array", items: { type: "string" } },
              },
              required: ["symbol", "indexes", "sourceStates"],
            },
          },
        },
        required: ["symbols"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
