import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mask, neighbors } from "../batch53-shared.js";

export type Input = Readonly<{ mask: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mask", label: "Mask", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  mask(i.mask);
  return {
    cells: i.mask.flatMap((row, r) =>
      row.flatMap((v, c) =>
        v && neighbors(r, c, false).some(([y, x]) => i.mask[y]?.[x] !== 1)
          ? [[r, c]]
          : [],
      ),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { mask: [[1, 1]] },
  output: {
    result: {
      cells: [
        [0, 0],
        [0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-border-cells",
  title: "Grid Mask Border Cells",
  description:
    "List set binary mask cells adjacent to a four-neighbor unset/outside position in stable row-major order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cells: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["cells"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
