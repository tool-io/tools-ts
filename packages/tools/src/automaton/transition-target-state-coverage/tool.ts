import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  transitionsJson: string;
  states: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "transitionsJson", label: "transitionsJson", kind: "string" },
  { id: "states", label: "states", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const t = H.transitions(i.transitionsJson);
  H.check(H.unique(i.states).length === i.states.length);
  return H.finish({
    missing: t.flatMap((v, index) =>
      i.states.includes(v.to) ? [] : [{ index, state: v.to }],
    ),
    missingSources: t.flatMap((v, index) =>
      i.states.includes(v.from) ? [] : [{ index, state: v.from }],
    ),
  });
};
export const example = {
  input: {
    transitionsJson:
      '[{"from": "a", "symbol": "x", "to": "b"}, {"from": "b", "symbol": "x", "to": "b"}]',
    states: ["a"],
  },
  output: {
    result: {
      missing: [
        { index: 0, state: "b" },
        { index: 1, state: "b" },
      ],
      missingSources: [{ index: 1, state: "b" }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["DFA Transition Target State Coverage"],
    collections: ["data", "learn"],
    fields: ["automaton"],
    keywords: [],
  },
  id: "automaton/transition-target-state-coverage",
  title: "DFA Transition Target State Coverage",
  description:
    "Audit transition source and target state references independently against an explicit declared state bank; no inferred undeclared states.",
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
          missing: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                state: { type: "string" },
              },
              required: ["index", "state"],
            },
          },
          missingSources: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                state: { type: "string" },
              },
              required: ["index", "state"],
            },
          },
        },
        required: ["missing", "missingSources"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
