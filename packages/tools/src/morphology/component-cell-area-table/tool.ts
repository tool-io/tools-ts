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
  const c = H.components(i.mask, i.eight);
  return H.finish({
    areas: c.cells.map((v, j) => ({ label: j + 1, area: v.length })),
  });
};
export const example = {
  input: {
    mask: [
      [1, 0],
      [0, 1],
    ],
    eight: false,
  },
  output: {
    result: {
      areas: [
        { label: 1, area: 1 },
        { label: 2, area: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/component-cell-area-table",
  title: "Binary Mask Component Cell Area Table",
  description:
    "Count cell areas of explicit four/eight-connected binary-mask foreground components; area is cells only, not calibrated physical area.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
