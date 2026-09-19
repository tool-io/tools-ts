import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string; index: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
  { id: "index", label: "index", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  const index = H.bigint(i.index),
    offsets = H.runOffsets(r);
  H.check(index >= 0n && index < H.runTotal(r));
  const at = r.findIndex(
    (v, j) => index >= offsets[j] && index < offsets[j] + v.length,
  );
  return H.finish({
    value: r[at].value,
    runIndex: at,
    offset: String(index - offsets[at]),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
    index: "5",
  },
  output: { result: { value: "b", runIndex: 2, offset: "0" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "runs/length-record-index-lookup",
  title: "Run Length Record Index Lookup",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; lookup one exact zero-based logical position with owning run and within-run offset; out-of-range positions reject.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
