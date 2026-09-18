import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string; edges: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.logs(i.recordsJson);
  H.check(i.edges.every((x, j) => j === 0 || x > i.edges[j - 1]));
  return H.finish({
    gaps: r.slice(1).map((v, j) => {
      const gap = v.time - r[j].time;
      return {
        index: j + 1,
        gap,
        bucket: i.edges.filter((x) => gap >= x).length,
      };
    }),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"id": "a", "time": 1, "source": "s", "level": "info", "message": "x", "sequence": 1}, {"id": "b", "time": 3, "source": "s", "level": "info", "message": "x", "sequence": 3}]',
    edges: [0, 1, 5],
  },
  output: { result: { gaps: [{ index: 1, gap: 2, bucket: 2 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-record-time-gap-buckets",
  title: "Log Record Time Gap Buckets",
  description:
    "Bucket signed adjacent log timestamp gaps by caller-supplied strictly increasing thresholds; negative clock jumps remain signed observations.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
