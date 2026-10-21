import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  return H.finish({ runs: H.runJson(H.runCompact(r)) });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
  },
  output: {
    result: {
      runs: [
        { value: "a", length: "5" },
        { value: "b", length: "4" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Adjacent Compaction",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-adjacent-compaction",
  title: "Run Length Record Adjacent Compaction",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; compact adjacent exactly equal values by summing exact lengths, not global deduplication.",
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
