import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  states: readonly string[];
  alphabet: readonly string[];
  start: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "states", label: "states", kind: "stringList" },
  { id: "alphabet", label: "alphabet", kind: "stringList" },
  { id: "start", label: "start", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.dfa(i.states, i.alphabet, t);
  H.check(i.states.includes(i.start));
  const found = H.reach(t, [i.start]);
  return H.finish({ states: found });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a", "b", "c"],
    alphabet: ["x"],
    start: "a",
  },
  output: { result: { states: ["a", "b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Reachable State Inventory"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/state-reachable-inventory",
  title: "DFA Reachable State Inventory",
  description:
    "Compute finite declared automaton forward reachability from an explicit start state; no minimization or language equivalence claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { states: { type: "array", items: { type: "string" } } },
        required: ["states"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
