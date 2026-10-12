import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  start: string;
  symbols: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "start", label: "start", kind: "string" },
  { id: "symbols", label: "symbols", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  const trace = H.trace(t, i.start, i.symbols);
  return H.finish(trace);
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    start: "a",
    symbols: ["x", "x"],
  },
  output: {
    result: { states: ["a", "b", "b"], edges: [0, 1], undefinedAt: null },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Symbol Sequence State Trace"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/symbol-sequence-state-trace",
  title: "DFA Symbol Sequence State Trace",
  description:
    "Trace supplied symbols through a deterministic partial automaton, retaining transition occurrence indexes and first undefined symbol index; stops without inventing a sink.",
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
          edges: { type: "array", items: { type: "number" } },
          undefinedAt: { anyOf: [{ type: "number" }, { type: "null" }] },
        },
        required: ["states", "edges", "undefinedAt"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
