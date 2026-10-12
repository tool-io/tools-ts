import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  state: string;
  symbol: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "state", label: "state", kind: "string" },
  { id: "symbol", label: "symbol", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.check(
    H.duplicates(t, (v) => JSON.stringify([v.from, v.symbol])).length === 0,
  );
  const matches = t.filter((v) => v.from === i.state && v.symbol === i.symbol);
  return H.finish({
    target: matches.length ? matches[0].to : null,
    defined: matches.length === 1,
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    state: "a",
    symbol: "x",
  },
  output: { result: { target: "b", defined: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Single Symbol Step"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/single-symbol-step",
  title: "DFA Single Symbol Step",
  description:
    "Step one supplied deterministic transition table, returning explicit undefined/null when no source/symbol pair exists; duplicate keys reject.",
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
          target: { anyOf: [{ type: "string" }, { type: "null" }] },
          defined: { type: "boolean" },
        },
        required: ["target", "defined"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
