import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  start: string;
  symbols: readonly string[];
  accepting: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "start", label: "start", kind: "string" },
  { id: "symbols", label: "symbols", kind: "stringList" },
  { id: "accepting", label: "accepting", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  const trace = H.trace(t, i.start, i.symbols);
  return H.finish({
    accepted:
      trace.undefinedAt === null && i.accepting.includes(trace.states.at(-1)!),
    undefinedAt: trace.undefinedAt,
    finalState: trace.states.at(-1)!,
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    start: "a",
    symbols: ["x", "x"],
    accepting: ["b"],
  },
  output: { result: { accepted: true, undefinedAt: null, finalState: "b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Symbol Sequence Acceptance"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/symbol-sequence-acceptance",
  title: "DFA Symbol Sequence Acceptance",
  description:
    "Evaluate exact finite input acceptance only when every transition is defined and the observed final state is explicitly accepting; no language inference.",
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
          accepted: { type: "boolean" },
          undefinedAt: { anyOf: [{ type: "number" }, { type: "null" }] },
          finalState: { type: "string" },
        },
        required: ["accepted", "undefinedAt", "finalState"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
