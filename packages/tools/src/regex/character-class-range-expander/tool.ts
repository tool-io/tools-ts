import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ ranges: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ranges", kind: "matrix", label: "ranges" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.ranges.every((r) => r.length === 2));
  const v: number[] = [];
  for (const [a, b] of i.ranges) {
    H.int(a, 0, 127);
    H.int(b, a, 127);
    for (let n = a; n <= b; n++) v.push(n);
  }
  return H.finish({ codes: H.unique(v).sort((a, b) => a - b) });
};
export const example = {
  input: {
    ranges: [
      [1, 3],
      [3, 4],
      [7, 7],
    ],
  },
  output: { result: { codes: [1, 2, 3, 4, 7] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/character-class-range-expander",
  title: "Character Class Range Expander",
  description:
    "Expand inclusive bounded ASCII code ranges into a canonical set, merging overlap but rejecting backwards ranges.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
