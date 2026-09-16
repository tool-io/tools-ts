import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ columnJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "columnJson", kind: "string", label: "columnJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.arr(i.columnJson);
  const tags = v.map((x) =>
    x === null ? "null" : Array.isArray(x) ? "array" : typeof x,
  );
  return H.finish({
    tags,
    counts: H.groups(tags, (x) => x).map((r) => ({
      tag: r.key,
      count: r.indexes.length,
    })),
  });
};
export const example = {
  input: { columnJson: '[null,1,"1",true,1]' },
  output: {
    result: {
      tags: ["null", "number", "string", "boolean", "number"],
      counts: [
        { tag: "null", count: 1 },
        { tag: "number", count: 2 },
        { tag: "string", count: 1 },
        { tag: "boolean", count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/table-column-type-tag-sampler",
  title: "Table Column Type Tag Profiler",
  description:
    "Profile actual JSON value types in a complete supplied column; no coercion, inferred dates or sampling bias.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
