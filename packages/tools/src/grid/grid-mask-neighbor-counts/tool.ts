import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mask, neighbors } from "../batch53-shared.js";

export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  diagonal: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "Mask", kind: "matrix" },
  { id: "diagonal", label: "Diagonal", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  mask(i.mask);
  return {
    counts: i.mask.map((row, r) =>
      row.map(
        (_, c) =>
          neighbors(r, c, i.diagonal).filter(([y, x]) => i.mask[y]?.[x] === 1)
            .length,
      ),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    mask: [
      [1, 0],
      [0, 1],
    ],
    diagonal: true,
  },
  output: {
    result: {
      counts: [
        [1, 2],
        [2, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-neighbor-counts",
  title: "Grid Mask Neighbor Count Table",
  description:
    "Count set neighbors for every mask cell under an explicit four/eight-neighbor convention; outside cells contribute zero.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
