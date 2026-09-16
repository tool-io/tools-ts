import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  index: number;
  columns: number;
  swatchWidth: number;
  swatchHeight: number;
  gapX: number;
  gapY: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", kind: "integer", label: "index" },
  { id: "columns", kind: "integer", label: "columns" },
  { id: "swatchWidth", kind: "number", label: "swatchWidth" },
  { id: "swatchHeight", kind: "number", label: "swatchHeight" },
  { id: "gapX", kind: "number", label: "gapX" },
  { id: "gapY", kind: "number", label: "gapY" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index);
  H.int(i.columns, 1, 128);
  H.positive(i.swatchWidth);
  H.positive(i.swatchHeight);
  H.check(i.gapX >= 0 && i.gapY >= 0);
  const row = Math.floor(i.index / i.columns),
    column = i.index % i.columns;
  return H.finish({
    row,
    column,
    x: column * (i.swatchWidth + i.gapX),
    y: row * (i.swatchHeight + i.gapY),
  });
};
export const example = {
  input: {
    index: 5,
    columns: 3,
    swatchWidth: 10,
    swatchHeight: 8,
    gapX: 2,
    gapY: 1,
  },
  output: { result: { row: 1, column: 2, x: 24, y: 9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-swatch-row-position",
  title: "Palette Swatch Row Position",
  description:
    "Place an explicit palette swatch index on a row-major grid with physical size and gaps; no renderer or color-space behavior.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
