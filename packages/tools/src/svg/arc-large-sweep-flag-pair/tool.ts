import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ largeArc: number; sweep: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "largeArc", kind: "integer", label: "largeArc" },
  { id: "sweep", kind: "integer", label: "sweep" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.largeArc, 0, 1);
  H.int(i.sweep, 0, 1);
  return H.finish({
    largeArc: i.largeArc === 1,
    sweep: i.sweep === 1,
    flags: `${i.largeArc} ${i.sweep}`,
  });
};
export const example = {
  input: { largeArc: 1, sweep: 0 },
  output: { result: { largeArc: true, sweep: false, flags: "1 0" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/arc-large-sweep-flag-pair",
  title: "SVG Arc Large Sweep Flag Pair Check",
  description:
    "Validate explicit SVG arc flag integers 0 or 1 and expose their boolean meanings; does not construct an ellipse.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
