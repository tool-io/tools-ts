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
    groups: H.runs(r, (v) =>
      JSON.stringify([v.source, v.level, v.message]),
    ).map((g) => ({
      start: g.start,
      end: g.end,
      source: r[g.start].source,
      level: r[g.start].level,
      message: r[g.start].message,
      count: g.end - g.start,
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
      groups: [
        {
          start: 0,
          end: 2,
          source: "s",
          level: "info",
          message: "x",
          count: 2,
          firstTime: 1,
          lastTime: 3,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-record-adjacent-message-groups",
  title: "Log Record Adjacent Message Groups",
  description:
    "Compact adjacent identical log source/level/message observations with count and time-envelope evidence, preserving adjacency rather than globally deduplicating.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
