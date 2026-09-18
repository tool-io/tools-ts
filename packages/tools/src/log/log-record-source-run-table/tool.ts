import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.logs(i.recordsJson);
  return H.finish({
    runs: H.runs(r, (v) => v.source).map((g) => ({
      ...g,
      firstTime: r[g.start].time,
      lastTime: r[g.end - 1].time,
    })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"id": "a", "time": 1, "source": "s", "level": "info", "message": "x", "sequence": 1}, {"id": "b", "time": 3, "source": "s", "level": "info", "message": "x", "sequence": 3}]',
  },
  output: {
    result: {
      runs: [{ key: "s", start: 0, end: 2, firstTime: 1, lastTime: 3 }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-record-source-run-table",
  title: "Log Record Source Run Table",
  description:
    "Group adjacent log source observations with original run indexes and first/last timestamps; no sorting or clock monotonicity assumptions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
