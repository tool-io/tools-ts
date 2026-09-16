import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ spansJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "spansJson", kind: "string", label: "spansJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const spans = H.spans(i.spansJson);
  spans.forEach(([a, b]) => {
    H.int(a);
    H.int(b);
  });
  return H.finish({ overlapPairs: H.overlaps(spans) });
};
export const example = {
  input: { spansJson: "[[0,3],[2,5],[5,6]]" },
  output: { result: { overlapPairs: [[0, 1]] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/fixed-width-layout-overlap-check",
  title: "Fixed Width Layout Overlap Check",
  description:
    "Audit positive overlap between half-open fixed-width text layout spans; touching and zero-width spans do not overlap.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
