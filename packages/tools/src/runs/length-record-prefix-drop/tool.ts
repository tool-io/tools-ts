import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string; count: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "count", label: "count", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  const count = H.bigint(i.count);
  H.check(count >= 0n && count <= H.runTotal(r));
  return H.finish({ runs: H.runJson(H.runSlice(r, count, H.runTotal(r))) });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    count: "4",
  },
  output: {
    result: {
      runs: [
        { value: "a", length: "1" },
        { value: "b", length: "4" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Prefix Drop",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-prefix-drop",
  title: "Run Length Record Prefix Drop",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; take an exact logical suffix after dropping a prefix without expanding or automatically compacting source runs; count beyond total rejects.",
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
          runs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: { type: "string" },
                length: { type: "string" },
              },
              required: ["value", "length"],
            },
          },
        },
        required: ["runs"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
