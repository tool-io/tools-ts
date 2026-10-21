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
  return H.finish({
    valid: true,
    records: r.length,
    total: String(H.runTotal(r)),
    adjacentEqual: r.flatMap((v, j) =>
      j && r[j - 1].value === v.value ? [j] : [],
    ),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
  },
  output: {
    result: { valid: true, records: 3, total: "9", adjacentEqual: [1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Validator",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-validator",
  title: "Run Length Record Validator",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; validate each supplied record and preserve noncanonical adjacent equal runs as explicit audit evidence.",
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
          valid: { type: "boolean" },
          records: { type: "number" },
          total: { type: "string" },
          adjacentEqual: { type: "array", items: { type: "number" } },
        },
        required: ["valid", "records", "total", "adjacentEqual"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
