import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ left: string; right: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", kind: "string", label: "left" },
  { id: "right", kind: "string", label: "right" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.left.length <= 128 && i.right.length <= 128);
  const indexes =
    i.left.length === i.right.length
      ? Array.from(
          { length: Math.max(0, i.left.length - 1) },
          (_, j) => j,
        ).filter(
          (j) =>
            i.left[j] !== i.left[j + 1] &&
            i.left.slice(0, j) +
              i.left[j + 1] +
              i.left[j] +
              i.left.slice(j + 2) ===
              i.right,
        )
      : [];
  return H.finish({ indexes });
};
export const example = {
  input: { left: "abcd", right: "acbd" },
  output: { result: { indexes: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/adjacent-transposition-witness",
  title: "Adjacent Transposition Witness",
  description:
    "Find exact one-adjacent-transposition witnesses between bounded UTF-16 strings; swapping equal adjacent units is excluded as no change.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
