import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ mask: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const c = H.components(i.mask, true);
  return H.finish({
    labels: c.labels,
    components: c.cells.map((cells, j) => ({ label: j + 1, cells })),
  });
};
export const example = {
  input: {
    mask: [
      [1, 0],
      [0, 1],
    ],
  },
  output: {
    result: {
      labels: [
        [1, 0],
        [0, 1],
      ],
      components: [
        {
          label: 1,
          cells: [
            [0, 0],
            [1, 1],
          ],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "morphology/eight-connected-component-labels",
  title: "Binary Mask Eight Connected Component Labels",
  description:
    "Label eight-connected foreground components of a supplied binary mask using row-major discovery and deterministic flood-fill; zero is background, no object identity inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
