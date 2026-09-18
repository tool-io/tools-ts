import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  start: string;
  symbols: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "start", label: "start", kind: "string" },
  { id: "symbols", label: "symbols", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  const trace = H.trace(t, i.start, i.symbols);
  return H.finish({
    undefinedAt: trace.undefinedAt,
    state: trace.states.at(-1)!,
    symbol: trace.undefinedAt === null ? null : i.symbols[trace.undefinedAt],
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    start: "a",
    symbols: ["x", "y"],
  },
  output: { result: { undefinedAt: 1, state: "b", symbol: "y" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "automaton/trace-first-undefined-transition",
  title: "DFA First Undefined Transition Finder",
  description:
    "Locate the first undefined transition in a supplied partial deterministic input trace, retaining state and symbol or null when complete.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
