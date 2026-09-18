import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ stencil: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "stencil", label: "stencil", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.stencil(i.stencil);
  return H.finish({
    rowRadius: Math.max(...i.stencil.map((v) => Math.abs(v[0]))),
    columnRadius: Math.max(...i.stencil.map((v) => Math.abs(v[1]))),
    chebyshevRadius: Math.max(...i.stencil.flat().map(Math.abs)),
  });
};
export const example = {
  input: {
    stencil: [
      [-2, 1],
      [1, 3],
    ],
  },
  output: { result: { rowRadius: 2, columnRadius: 3, chebyshevRadius: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/stencil-required-radius-budget",
  title: "Binary Mask Stencil Required Radius Budget",
  description:
    "Budget explicit stencil row/column halo radii and maximum Chebyshev radius without expanding a kernel or inferring physical pixel dimensions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
