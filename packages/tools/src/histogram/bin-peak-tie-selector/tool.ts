import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ mass: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mass", label: "mass", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.nonnegative(i.mass);
  return H.finish({
    maximum: i.mass.length ? Math.max(...i.mass) : null,
    indexes: i.mass.length
      ? i.mass.flatMap((x, j) => (x === Math.max(...i.mass) ? [j] : []))
      : [],
  });
};
export const example = {
  input: { mass: [2, 3, 3] },
  output: { result: { maximum: 3, indexes: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "histogram/bin-peak-tie-selector",
  title: "Histogram Peak Tie Selector",
  description:
    "Select every observed maximum histogram bin, retaining ties; an empty bank has null maximum, an all-zero bank ties every supplied bin.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
