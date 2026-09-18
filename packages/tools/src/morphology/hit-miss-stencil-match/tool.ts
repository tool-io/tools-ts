import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  foreground: readonly (readonly number[])[];
  background: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "foreground", label: "foreground", kind: "matrix" },
  { id: "background", label: "background", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.mask(i.mask);
  H.stencil(i.foreground);
  H.stencil(i.background);
  H.check(
    !i.foreground.some((v) =>
      i.background.some((w) => v[0] === w[0] && v[1] === w[1]),
    ),
  );
  return H.finish({
    mask: i.mask.map((row, y) =>
      row.map((_, x) =>
        Number(
          i.foreground.every(
            ([dy, dx]) => (i.mask[y + dy]?.[x + dx] ?? 0) === 1,
          ) &&
            i.background.every(
              ([dy, dx]) => (i.mask[y + dy]?.[x + dx] ?? 0) === 0,
            ),
        ),
      ),
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
    foreground: [[0, 0]],
    background: [[0, 1]],
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
  id: "morphology/hit-miss-stencil-match",
  title: "Binary Mask Hit Miss Stencil Match",
  description:
    "Explicit binary masks <=64x64 and unique integer [row,column] stencil offsets in +/-16, outside treated as zero; match explicit disjoint foreground-one and background-zero offsets; outside satisfies background only, no inferred structuring element.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
