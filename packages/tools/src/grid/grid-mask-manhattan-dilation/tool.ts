import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mask } from "../batch53-shared.js";

export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  radius: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mask", label: "Mask", kind: "matrix" },
  { id: "radius", label: "Radius", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  mask(i.mask);
  bounded(i.radius, "radius", 0, 8);
  return {
    mask: i.mask.map((row, r) =>
      row.map((_, c) => {
        let hit = false;
        for (let dr = -i.radius; dr <= i.radius; dr++)
          for (let dc = -i.radius; dc <= i.radius; dc++)
            if (Math.abs(dr) + Math.abs(dc) <= i.radius) {
              if (i.mask[r + dr]?.[c + dc] === 1) hit = true;
            }
        return hit ? 1 : 0;
      }),
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    mask: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
    radius: 1,
  },
  output: {
    result: {
      mask: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-manhattan-dilation",
  title: "Grid Mask Manhattan Dilation",
  description:
    "Apply manhattan binary morphology in the original grid, radius 0–8, treating outside cells as zero; no automatic resizing or physical-distance model.",
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
          mask: {
            type: "array",
            items: { type: "array", items: { type: "number" } },
          },
        },
        required: ["mask"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
