import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ countsJson: string; cap: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "countsJson", kind: "string", label: "countsJson" },
  { id: "cap", kind: "integer", label: "cap" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.cap, 0, 1e6);
  return H.finish({
    counts: H.msRows(H.multiset(i.countsJson))
      .map((v) => ({ ...v, count: Math.min(v.count, i.cap) }))
      .filter((v) => v.count > 0),
  });
};
export const example = {
  input: {
    countsJson: '[{"value":"a","count":3},{"value":"b","count":1}]',
    cap: 2,
  },
  output: {
    result: {
      counts: [
        { value: "a", count: 2 },
        { value: "b", count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/multiplicity-capped-table",
  title: "Multiset Capped Count Table",
  description:
    "Cap each normalized typed multiplicity at an explicit nonnegative integer and omit resulting zeros; no proportional redistribution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
