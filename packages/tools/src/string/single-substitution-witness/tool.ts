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
  const diffs =
    i.left.length === i.right.length
      ? i.left.split("").flatMap((x, j) => (x !== i.right[j] ? [j] : []))
      : [];
  return H.finish({ index: diffs.length === 1 ? diffs[0] : null });
};
export const example = {
  input: { left: "abc", right: "axc" },
  output: { result: { index: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/single-substitution-witness",
  title: "Single Substitution Witness",
  description:
    "Witness exactly one changed UTF-16 unit between equal-length strings; zero or multiple changes yield null, not a fuzzy distance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
