import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  states: readonly string[];
  alphabet: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "states", label: "states", kind: "stringList" },
  { id: "alphabet", label: "alphabet", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.dfa(i.states, i.alphabet, t);
  return H.finish({
    missing: i.states.flatMap((state) =>
      i.alphabet
        .filter(
          (symbol) => !t.some((v) => v.from === state && v.symbol === symbol),
        )
        .map((symbol) => ({ state, symbol })),
    ),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a", "b", "c"],
    alphabet: ["x"],
  },
  output: { result: { missing: [{ state: "c", symbol: "x" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "automaton/alphabet-transition-completeness",
  title: "DFA Alphabet Transition Completeness",
  description:
    "Audit every declared state/alphabet pair for absent transition keys in a finite deterministic automaton; no sink completion or unbounded alphabet.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
