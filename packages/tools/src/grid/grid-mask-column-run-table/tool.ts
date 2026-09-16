import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, runs, mask } from "../batch53-shared.js";

export type Input = Readonly<{ mask: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "Mask", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const d = mask(i.mask),
    a = Array.from({ length: d.columns }, (_, x) => i.mask.map((r) => r[x]));
  return {
    runs: a.flatMap((r, j) =>
      runs(r)
        .filter((v) => v.value === 1)
        .map((v) => ({ column: j, start: v.start, end: v.end })),
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
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  output: {
    result: {
      runs: [
        { column: 0, start: 0, end: 1 },
        { column: 1, start: 0, end: 2 },
        { column: 2, start: 1, end: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-column-run-table",
  title: "Grid Mask Column Run Table",
  description:
    "Tabulate maximal set-cell runs along columns of a rectangular binary mask with half-open local bounds.",
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
