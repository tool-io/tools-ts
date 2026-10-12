import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  states: readonly string[];
  alphabet: readonly string[];
  names: readonly string[];
  replacements: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "states", label: "states", kind: "stringList" },
  { id: "alphabet", label: "alphabet", kind: "stringList" },
  { id: "names", label: "names", kind: "stringList" },
  { id: "replacements", label: "replacements", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.dfa(i.states, i.alphabet, t);
  const original = i.states,
    renamed = H.rename(original, i.names, i.replacements);
  H.check(i.names.every((x) => original.includes(x)));
  const map = new Map(original.map((v, j) => [v, renamed[j]]));
  return H.finish({
    states: renamed,
    alphabet: i.alphabet,
    transitions: t.map((v) => ({
      ...v,
      from: map.get(v.from)!,
      to: map.get(v.to)!,
    })),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a", "b", "c"],
    alphabet: ["x"],
    names: ["a"],
    replacements: ["z"],
  },
  output: {
    result: {
      states: ["z", "b", "c"],
      alphabet: ["x"],
      transitions: [
        { from: "z", symbol: "x", to: "b" },
        { from: "b", symbol: "x", to: "b" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA State Renaming Transform"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/state-renaming-transform",
  title: "DFA State Renaming Transform",
  description:
    "Apply an explicit injective automaton state renaming to a validated deterministic transition table; collisions reject, no label coercion.",
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
          states: { type: "array", items: { type: "string" } },
          alphabet: { type: "array", items: { type: "string" } },
          transitions: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                symbol: { type: "string" },
                from: { type: "string" },
                to: { type: "string" },
              },
              required: ["symbol", "from", "to"],
            },
          },
        },
        required: ["states", "alphabet", "transitions"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
