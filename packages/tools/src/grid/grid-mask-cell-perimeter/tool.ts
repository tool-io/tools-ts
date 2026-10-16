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
  let perimeter = 0;
  for (let r = 0; r < i.mask.length; r++)
    for (let c = 0; c < i.mask[r].length; c++)
      if (i.mask[r][c])
        perimeter += neighbors(r, c, false).filter(
          ([y, x]) => i.mask[y]?.[x] !== 1,
        ).length;
  return { unitEdgePerimeter: perimeter };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { mask: [[1, 1]] },
  output: { result: { unitEdgePerimeter: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-cell-perimeter",
  title: "Grid Mask Cell Perimeter",
  description:
    "Count four-neighbor exposed unit edges of set cells, including outer grid edges and holes; not a subpixel contour length.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { unitEdgePerimeter: { type: "number" } },
        required: ["unitEdgePerimeter"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
