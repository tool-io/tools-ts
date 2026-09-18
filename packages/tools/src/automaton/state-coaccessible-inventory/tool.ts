import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  states: readonly string[];
  alphabet: readonly string[];
  accepting: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "states", label: "states", kind: "stringList" },
  { id: "alphabet", label: "alphabet", kind: "stringList" },
  { id: "accepting", label: "accepting", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.dfa(i.states, i.alphabet, t);
  H.check(i.accepting.every((x) => i.states.includes(x)));
  const found = H.reach(t, i.accepting, true);
  return H.finish({ states: found });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a", "b", "c"],
    alphabet: ["x"],
    accepting: ["b"],
  },
  output: { result: { states: ["b", "a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "automaton/state-coaccessible-inventory",
  title: "DFA Coaccessible State Inventory",
  description:
    "Compute finite declared automaton reverse reachability from explicit accepting states; no minimization or language equivalence claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
