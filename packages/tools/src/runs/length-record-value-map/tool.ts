import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  runsJson: string;
  names: readonly string[];
  replacements: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "names", label: "names", kind: "stringList" },
  { id: "replacements", label: "replacements", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  H.check(
    i.names.length === i.replacements.length &&
      H.unique(i.names).length === i.names.length,
  );
  const map = new Map(i.names.map((v, j) => [v, i.replacements[j]]));
  return H.finish({
    runs: H.runJson(
      H.runCompact(
        r.map((v) => ({ ...v, value: map.get(v.value) ?? v.value })),
      ),
    ),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    names: ["b"],
    replacements: ["a"],
  },
  output: { result: { runs: [{ value: "a", length: "9" }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Value Map",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-value-map",
  title: "Run Length Record Value Map",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; map explicit literal values by a unique-key caller map and compact newly adjacent equal runs; mapping may deliberately merge values.",
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
