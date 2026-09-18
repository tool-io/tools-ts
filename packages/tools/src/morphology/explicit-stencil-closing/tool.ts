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
  return H.finish({
    mask: H.morph(H.morph(i.mask, i.stencil, false), i.stencil, true),
  });
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
        [0, 1, 0],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/explicit-stencil-closing",
  title: "Binary Mask Explicit Stencil Closing",
  description:
    "Explicit binary masks <=64x64 and unique integer [row,column] stencil offsets in +/-16, outside treated as zero; perform closing: dilation followed by erosion with zero extension at each bounded stage; finite-border artifacts are retained.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
