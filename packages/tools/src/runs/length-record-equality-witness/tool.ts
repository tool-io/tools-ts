import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "leftJson", label: "leftJson", kind: "string" },
  { id: "rightJson", label: "rightJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = H.lengthRuns(i.leftJson),
    b = H.lengthRuns(i.rightJson),
    pairs = H.runPairs(a, b);
  const first = pairs.find((v) => v.left !== v.right);
  return H.finish({
    equal: !first,
    witness: first
      ? { offset: first.start, left: first.left, right: first.right }
      : null,
  });
};
export const example = {
  input: {
    leftJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    rightJson: '[{"value":"a","length":"4"},{"value":"c","length":"5"}]',
  },
  output: {
    result: { equal: false, witness: { offset: "4", left: "a", right: "c" } },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Equality Witness",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-equality-witness",
  title: "Run Length Record Equality Witness",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; compare equal-length encoded sequences without expansion, reporting the first exact unequal-value offset independent of encoded boundary placement.",
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
          equal: { type: "boolean" },
          witness: {
            anyOf: [
              {
                type: "object",
                additionalProperties: false,
                properties: {
                  offset: { type: "string" },
                  left: { type: "string" },
                  right: { type: "string" },
                },
                required: ["offset", "left", "right"],
              },
              { type: "null" },
            ],
          },
        },
        required: ["equal", "witness"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
