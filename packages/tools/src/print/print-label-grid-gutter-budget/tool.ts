import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  sheetWidth: number;
  labelWidth: number;
  columns: number;
  margin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sheetWidth", kind: "number", label: "sheetWidth" },
  { id: "labelWidth", kind: "number", label: "labelWidth" },
  { id: "columns", kind: "integer", label: "columns" },
  { id: "margin", kind: "number", label: "margin" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.sheetWidth);
  H.positive(i.labelWidth);
  H.int(i.columns, 2, 128);
  H.check(i.margin >= 0);
  const free = i.sheetWidth - 2 * i.margin - i.columns * i.labelWidth;
  return H.finish({ availableGutter: free / (i.columns - 1), fits: free >= 0 });
};
export const example = {
  input: { sheetWidth: 110, labelWidth: 30, columns: 3, margin: 5 },
  output: { result: { availableGutter: 5, fits: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-label-grid-gutter-budget",
  title: "Print Label Grid Gutter Budget",
  description:
    "Budget equal horizontal label gutters from explicit sheet, margins and label widths; negative gutter remains a fit failure.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
