import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ width: number; height: number; margin: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", kind: "number", label: "width" },
  { id: "height", kind: "number", label: "height" },
  { id: "margin", kind: "number", label: "margin" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.width);
  H.positive(i.height);
  H.check(i.margin >= 0);
  return H.finish({
    width: i.width + 2 * i.margin,
    height: i.height + 2 * i.margin,
  });
};
export const example = {
  input: { width: 100, height: 80, margin: 3 },
  output: { result: { width: 106, height: 86 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/trim-bleed-outer-dimensions",
  title: "Trim Bleed Outer Dimensions",
  description:
    "Compute rectangular trim-plus-bleed exterior dimensions from explicit same-unit symmetric margins; not a print-production specification.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
