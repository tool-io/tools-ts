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
    mask: i.mask.map((row, y) =>
      row.map((x, j) =>
        x === 1 || (c.labels[y][j] > 0 && !boundary.has(c.labels[y][j]))
          ? 1
          : 0,
      ),
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
  output: {
    result: {
      mask: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/enclosed-hole-fill",
  title: "Binary Mask Enclosed Hole Fill",
  description:
    "Fill only zero components not touching the finite mask boundary under explicit connectivity, preserving existing foreground and bounded frame.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
