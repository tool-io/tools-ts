import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ leftJson: string; rightJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leftJson", kind: "string", label: "leftJson" },
  { id: "rightJson", kind: "string", label: "rightJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.multiset(i.leftJson),
    b = H.multiset(i.rightJson),
    keys = H.unique([...a.keys(), ...b.keys()]);
  const counts = keys
    .map((k) => {
      const x = a.get(k)?.count ?? 0,
        y = b.get(k)?.count ?? 0;
      return { value: (a.get(k) ?? b.get(k))!.value, count: Math.min(x, y) };
    })
    .filter((v) => v.count > 0);
  return H.finish({ counts });
};
export const example = {
  input: {
    leftJson: '[{"value":"a","count":3},{"value":"b","count":1}]',
    rightJson: '[{"value":"a","count":2},{"value":"c","count":2}]',
  },
  output: { result: { counts: [{ value: "a", count: 2 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/multiplicity-min-intersection",
  title: "Multiset Minimum Intersection",
  description:
    "Compute typed multiset minimum intersection from exact scalar identities and nonnegative integer counts; duplicate count rows are summed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
