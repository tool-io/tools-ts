import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  primary: readonly number[];
  fallback: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "primary", label: "primary", kind: "numberList" },
  { id: "fallback", label: "fallback", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.primary.length === i.fallback.length);
  return H.finish({
    deltas: i.primary.map((x, j) => i.fallback[j] - x),
    totalDelta:
      i.fallback.reduce((s, x) => s + x, 0) -
      i.primary.reduce((s, x) => s + x, 0),
  });
};
export const example = {
  input: { primary: [4, 5], fallback: [5, 3] },
  output: { result: { deltas: [1, -2], totalDelta: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glyph/glyph-fallback-metric-delta-table",
  title: "Glyph Fallback Metric Delta Table",
  description:
    "Compare paired supplied primary/fallback glyph advances and total run shift; caller must establish glyph correspondence, no shaping equivalence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
