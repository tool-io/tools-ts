import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "numberList", label: "left" },
  { id: "right", kind: "numberList", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.left, i.right].forEach((r) => r.forEach((x) => H.int(x, 0, 127)));
  return H.finish({
    overlap: H.unique(i.left)
      .filter((x) => i.right.includes(x))
      .sort((a, b) => a - b),
  });
};
export const example = {
  input: { left: [1, 2, 2], right: [2, 3] },
  output: { result: { overlap: [2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/character-class-overlap-table",
  title: "Character Class Overlap Table",
  description:
    "Return exact overlap codes between explicit ASCII character banks; no Unicode normalization or regex execution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
