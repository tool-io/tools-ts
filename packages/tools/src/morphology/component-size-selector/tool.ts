import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  eight: boolean;
  minimum: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "eight", label: "eight", kind: "boolean" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.minimum, 0, 4096);
  H.int(i.maximum, i.minimum, 4096);
  const c = H.components(i.mask, i.eight);
  return H.finish({
    mask: c.labels.map((row) =>
      row.map((label) =>
        Number(
          label > 0 &&
            c.cells[label - 1].length >= i.minimum &&
            c.cells[label - 1].length <= i.maximum,
        ),
      ),
    ),
  });
};
export const example = {
  input: {
    mask: [
      [1, 0],
      [0, 1],
    ],
    eight: false,
    minimum: 2,
    maximum: 5,
  },
  output: {
    result: {
      mask: [
        [0, 0],
        [0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/component-size-selector",
  title: "Binary Mask Component Size Selector",
  description:
    "Retain entire connected foreground components only when their explicit cell count falls in inclusive caller bounds, no partial size trimming.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
