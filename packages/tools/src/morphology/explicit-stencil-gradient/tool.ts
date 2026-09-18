import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  stencil: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "stencil", label: "stencil", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.mask(i.mask);
  H.stencil(i.stencil);
  const d = H.morph(i.mask, i.stencil),
    e = H.morph(i.mask, i.stencil, true);
  return H.finish({ mask: d.map((row, y) => row.map((v, x) => v - e[y][x])) });
};
export const example = {
  input: {
    mask: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    stencil: [
      [0, 0],
      [0, 1],
    ],
  },
  output: {
    result: {
      mask: [
        [0, 0, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/explicit-stencil-gradient",
  title: "Binary Mask Explicit Stencil Gradient",
  description:
    "Explicit binary masks <=64x64 and unique integer [row,column] stencil offsets in +/-16, outside treated as zero; return signed dilation-minus-erosion gradient, retaining signed evidence for stencils lacking the origin rather than silently clipping.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
