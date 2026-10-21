import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  runsJson: string;
  start: string;
  end: string;
  replacementJson: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "start", label: "start", kind: "string" },
  { id: "end", label: "end", kind: "string" },
  { id: "replacementJson", label: "replacementJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  const start = H.bigint(i.start),
    end = H.bigint(i.end),
    replacement = H.lengthRuns(i.replacementJson);
  H.check(start >= 0n && end >= start && end <= H.runTotal(r));
  return H.finish({
    runs: H.runJson(
      H.runCompact([
        ...H.runSlice(r, 0n, start),
        ...replacement,
        ...H.runSlice(r, end, H.runTotal(r)),
      ]),
    ),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    start: "2",
    end: "6",
    replacementJson: '[{"value":"c","length":"1"}]',
  },
  output: {
    result: {
      runs: [
        { value: "a", length: "2" },
        { value: "c", length: "1" },
        { value: "b", length: "3" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Range Splice",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-range-splice",
  title: "Run Length Record Range Splice",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; splice a bounded exact half-open range with encoded replacement records and compact the resulting join boundaries.",
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
