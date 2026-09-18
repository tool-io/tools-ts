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
  H.check(
    i.states.every((state) =>
      i.alphabet.every((symbol) =>
        t.some((v) => v.from === state && v.symbol === symbol),
      ),
    ),
  );
  return H.finish({
    accepting: i.states.filter((x) => !i.accepting.includes(x)),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a", "b"],
    alphabet: ["x"],
    accepting: ["b"],
  },
  output: { result: { accepting: ["a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "automaton/acceptance-complement-state-set",
  title: "Complete DFA Acceptance Complement Set",
  description:
    "Complement accepting states only for an explicitly complete deterministic finite automaton; incomplete transition tables reject rather than claim language complement.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
