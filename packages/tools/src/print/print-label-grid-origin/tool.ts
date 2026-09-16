import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  row: number;
  column: number;
  labelWidth: number;
  labelHeight: number;
  gutterX: number;
  gutterY: number;
  originX: number;
  originY: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "row", kind: "integer", label: "row" },
  { id: "column", kind: "integer", label: "column" },
  { id: "labelWidth", kind: "number", label: "labelWidth" },
  { id: "labelHeight", kind: "number", label: "labelHeight" },
  { id: "gutterX", kind: "number", label: "gutterX" },
  { id: "gutterY", kind: "number", label: "gutterY" },
  { id: "originX", kind: "number", label: "originX" },
  { id: "originY", kind: "number", label: "originY" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.row);
  H.int(i.column);
  H.positive(i.labelWidth);
  H.positive(i.labelHeight);
  H.check(i.gutterX >= 0 && i.gutterY >= 0);
  return H.finish({
    x: i.originX + i.column * (i.labelWidth + i.gutterX),
    y: i.originY + i.row * (i.labelHeight + i.gutterY),
  });
};
export const example = {
  input: {
    row: 2,
    column: 1,
    labelWidth: 30,
    labelHeight: 20,
    gutterX: 5,
    gutterY: 2,
    originX: 3,
    originY: 4,
  },
  output: { result: { x: 38, y: 48 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-label-grid-origin",
  title: "Print Label Grid Origin",
  description:
    "Place a label-grid cell origin from explicit zero-based coordinates, dimensions, gutters and starting origin; no sheet bounds assumed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
