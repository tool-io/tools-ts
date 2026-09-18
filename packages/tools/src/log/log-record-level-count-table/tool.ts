import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ recordsJson: string; aliasesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "recordsJson", label: "recordsJson", kind: "string" },
  { id: "aliasesJson", label: "aliasesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.logs(i.recordsJson);
  const m = H.aliases(i.aliasesJson);
  return H.finish({
    counts: H.groups(r, (v) =>
      JSON.stringify(H.resolveAlias(m, v.level).terminal),
    ).map((g) => ({
      level: JSON.parse(g.key) as string | null,
      ...(g.key === "null" ? { aliasCycle: true } : {}),
      count: g.indexes.length,
      indexes: g.indexes,
    })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"id": "a", "time": 1, "source": "s", "level": "info", "message": "x", "sequence": 1}, {"id": "b", "time": 3, "source": "s", "level": "info", "message": "x", "sequence": 3}]',
    aliasesJson: '[{"name":"info","target":"notice"}]',
  },
  output: {
    result: { counts: [{ level: "notice", count: 2, indexes: [0, 1] }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "log/log-record-level-count-table",
  title: "Log Record Level Count Table",
  description:
    "Count explicit log severity observations after caller alias normalization, retaining source indexes and an explicit alias-cycle category; not a universal level classification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
