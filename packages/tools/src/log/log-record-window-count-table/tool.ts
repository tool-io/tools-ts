import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string; windowsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "windowsJson", label: "windowsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.logs(i.recordsJson);
  const w = H.spans(i.windowsJson);
  return H.finish({
    counts: w.map(([a, b]) => ({
      start: a,
      end: b,
      count: r.filter((v) => v.time >= a && v.time < b).length,
    })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"id": "a", "time": 1, "source": "s", "level": "info", "message": "x", "sequence": 1}, {"id": "b", "time": 3, "source": "s", "level": "info", "message": "x", "sequence": 3}]',
    windowsJson: "[[0,2],[2,4]]",
  },
  output: {
    result: {
      counts: [
        { start: 0, end: 2, count: 1 },
        { start: 2, end: 4, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-record-window-count-table",
  title: "Log Record Window Count Table",
  description:
    "Count explicit log observations in caller half-open timestamp windows, allowing overlapping windows and duplicate observations; no inferred event rates.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
