import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ codes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codes", kind: "numberList", label: "codes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.codes.forEach((x) => H.int(x, 0, 127));
  const v = H.unique(i.codes).sort((a, b) => a - b),
    ranges: number[][] = [];
  for (const x of v) {
    const p = ranges.at(-1);
    if (p && x === p[1] + 1) p[1] = x;
    else ranges.push([x, x]);
  }
  return H.finish({ ranges });
};
export const example = {
  input: { codes: [3, 1, 2, 5] },
  output: {
    result: {
      ranges: [
        [1, 3],
        [5, 5],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/character-class-range-compactor",
  title: "Character Class Range Compactor",
  description:
    "Compact an explicit ASCII code set into sorted inclusive contiguous ranges, preserving singleton endpoints.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
