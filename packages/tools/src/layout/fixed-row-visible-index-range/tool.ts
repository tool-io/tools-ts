import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch53-shared.js";

export type Input = Readonly<{
  rowCount: number;
  rowExtent: number;
  viewportStart: number;
  viewportExtent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rowCount", label: "Row count", kind: "number" },
  { id: "rowExtent", label: "Row extent", kind: "number" },
  { id: "viewportStart", label: "Viewport start", kind: "number" },
  { id: "viewportExtent", label: "Viewport extent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.rowCount, "count", 0, 1e6);
  positive(i.rowExtent, "row");
  nonnegative(i.viewportStart, "start");
  nonnegative(i.viewportExtent, "viewport");
  const first = Math.min(i.rowCount, Math.floor(i.viewportStart / i.rowExtent)),
    end =
      i.viewportExtent === 0
        ? first
        : Math.min(
            i.rowCount,
            Math.ceil((i.viewportStart + i.viewportExtent) / i.rowExtent),
          );
  return { firstIndex: first, endExclusive: Math.max(first, end) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rowCount: 10, rowExtent: 20, viewportStart: 15, viewportExtent: 30 },
  output: { result: { firstIndex: 0, endExclusive: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/fixed-row-visible-index-range",
  title: "Fixed Row Visible Index Range",
  description:
    "Plan half-open visible fixed-row indexes with positive geometric intersection; exact end contacts are excluded and empty viewports contain no rows.",
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
