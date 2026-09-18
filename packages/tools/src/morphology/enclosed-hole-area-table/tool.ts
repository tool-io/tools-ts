import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  eight: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "eight", label: "eight", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const c = H.components(i.mask, i.eight, 0),
    h = i.mask.length,
    w = i.mask[0]?.length ?? 0;
  const boundary = new Set(
    c.cells.flatMap((cells, j) =>
      cells.some(([y, x]) => y === 0 || x === 0 || y === h - 1 || x === w - 1)
        ? [j + 1]
        : [],
    ),
  );
  return H.finish({
    holes: c.cells.flatMap((v, j) =>
      boundary.has(j + 1) ? [] : [{ label: j + 1, area: v.length }],
    ),
  });
};
export const example = {
  input: {
    mask: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    eight: false,
  },
  output: { result: { holes: [{ label: 1, area: 1 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/enclosed-hole-area-table",
  title: "Binary Mask Enclosed Hole Area Table",
  description:
    "Inventory enclosed background component cell counts under explicit connectivity, excluding all boundary-connected zero regions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
