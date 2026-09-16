import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ valuesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "valuesJson", kind: "string", label: "valuesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.arr(i.valuesJson);
  H.check(
    v.every(
      (x) => x === null || ["string", "boolean", "number"].includes(typeof x),
    ),
  );
  return H.finish({
    counts: H.groups(v, (x) => JSON.stringify(x)).map((g) => ({
      value: v[g.indexes[0]],
      count: g.indexes.length,
    })),
  });
};
export const example = {
  input: { valuesJson: '[1,"1",1,true,null]' },
  output: {
    result: {
      counts: [
        { value: 1, count: 2 },
        { value: "1", count: 1 },
        { value: true, count: 1 },
        { value: null, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/typed-value-count-table",
  title: "Typed Value Count Table",
  description:
    "Count typed JSON scalar occurrences, preserving number/string/boolean/null identity; unlike a string frequency counter it does not coerce keys.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
