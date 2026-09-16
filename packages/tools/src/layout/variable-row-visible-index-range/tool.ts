import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  rowExtents: readonly number[];
  viewportStart: number;
  viewportExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rowExtents", label: "Row extents", kind: "numberList" },
  { id: "viewportStart", label: "Viewport start", kind: "number" },
  { id: "viewportExtent", label: "Viewport extent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.rowExtents.forEach((v) => positive(v, "row"));
  nonnegative(i.viewportStart, "start");
  nonnegative(i.viewportExtent, "viewport");
  let start = 0;
  const indexes: number[] = [];
  i.rowExtents.forEach((v, j) => {
    if (
      i.viewportExtent > 0 &&
      start < i.viewportStart + i.viewportExtent &&
      start + v > i.viewportStart
    )
      indexes.push(j);
    start += v;
  });
  return {
    visibleIndexes: indexes,
    firstIndex: indexes.length ? indexes[0] : null,
    endExclusive: indexes.length ? indexes.at(-1)! + 1 : null,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rowExtents: [10, 20, 30], viewportStart: 10, viewportExtent: 20 },
  output: { result: { visibleIndexes: [1], firstIndex: 1, endExclusive: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/variable-row-visible-index-range",
  title: "Variable Row Visible Index Range",
  description:
    "Plan visible indexes for explicit positive variable row extents; retain an empty result rather than infer estimated heights.",
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
