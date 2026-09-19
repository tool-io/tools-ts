import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string; start: string; end: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "start", label: "start", kind: "string" },
  { id: "end", label: "end", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  return H.finish({
    runs: H.runJson(H.runSlice(r, H.bigint(i.start), H.bigint(i.end))),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    start: "2",
    end: "7",
  },
  output: {
    result: {
      runs: [
        { value: "a", length: "1" },
        { value: "a", length: "2" },
        { value: "b", length: "2" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-range-slice",
  title: "Run Length Record Range Slice",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; slice an exact half-open logical interval without expansion, preserving interior source-run boundaries.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
