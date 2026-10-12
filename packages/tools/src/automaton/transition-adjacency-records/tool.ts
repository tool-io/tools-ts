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
    adjacency: i.states.map((state) => ({
      state,
      outgoing: t.flatMap((v, index) =>
        v.from === state ? [{ index, symbol: v.symbol, to: v.to }] : [],
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
      adjacency: [
        { state: "a", outgoing: [{ index: 0, symbol: "x", to: "b" }] },
        { state: "b", outgoing: [{ index: 1, symbol: "x", to: "b" }] },
        { state: "c", outgoing: [] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Transition Adjacency Records"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/transition-adjacency-records",
  title: "DFA Transition Adjacency Records",
  description:
    "Expose labeled outgoing adjacency with original transition indexes for every declared deterministic automaton state, including states without outgoing edges.",
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
          adjacency: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                state: { type: "string" },
                outgoing: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      index: { type: "number" },
                      symbol: { type: "string" },
                      to: { type: "string" },
                    },
                    required: ["index", "symbol", "to"],
                  },
                },
              },
              required: ["state", "outgoing"],
            },
          },
        },
        required: ["adjacency"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
