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
    counts: t.map((_, index) => trace.edges.filter((x) => x === index).length),
    undefinedAt: trace.undefinedAt,
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    start: "a",
    symbols: ["x", "x"],
  },
  output: { result: { counts: [1, 1], undefinedAt: null } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "automaton/transition-occurrence-counts",
  title: "DFA Transition Occurrence Counts",
  description:
    "Count supplied transition occurrence use along a deterministic symbol trace, retaining unused transitions and first undefined input evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
