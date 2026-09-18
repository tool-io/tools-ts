import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  eight: boolean;
  row: number;
  column: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "eight", label: "eight", kind: "boolean" },
  { id: "row", label: "row", kind: "integer" },
  { id: "column", label: "column", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const c = H.components(i.mask, i.eight);
  H.int(i.row, 0, i.mask.length - 1);
  H.int(i.column, 0, i.mask[i.row].length - 1);
  const label = c.labels[i.row][i.column];
  return H.finish({
    label,
    mask: c.labels.map((row) =>
      row.map((x) => Number(label > 0 && x === label)),
    ),
  });
};
export const example = {
  input: {
    mask: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    eight: false,
    row: 1,
    column: 1,
  },
  output: {
    result: {
      label: 1,
      mask: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/seed-component-mask",
  title: "Binary Mask Seed Component Mask",
  description:
    "Select only the connected foreground component containing a supplied in-bounds cell; a background seed yields label zero and an empty mask.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
