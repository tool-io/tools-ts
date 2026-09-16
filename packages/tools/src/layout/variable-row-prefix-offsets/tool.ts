import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch53-shared.js";

export type Input = Readonly<{ rowExtents: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rowExtents", label: "Row extents", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.rowExtents.forEach((v) => nonnegative(v, "extent"));
  let k = 0;
  const offsets = [0];
  for (const v of i.rowExtents) {
    k += v;
    offsets.push(k);
  }
  return { boundaryOffsets: offsets, totalExtent: k };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rowExtents: [10, 20] },
  output: { result: { boundaryOffsets: [0, 10, 30], totalExtent: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/variable-row-prefix-offsets",
  title: "Variable Row Prefix Offsets",
  description:
    "Compute cumulative variable-row boundary offsets, including the terminal boundary and explicit zero-height rows.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
