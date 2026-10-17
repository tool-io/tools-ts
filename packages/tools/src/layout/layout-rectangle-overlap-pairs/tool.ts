import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  rectangle,
  intersection,
} from "../batch53-shared.js";

export type Input = Readonly<{ rectangles: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "rectangles", label: "Rectangles", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  i.rectangles.forEach(rectangle);
  const pairs: {
    leftIndex: number;
    rightIndex: number;
    overlapArea: number;
  }[] = [];
  for (let a = 0; a < i.rectangles.length; a++)
    for (let b = a + 1; b < i.rectangles.length; b++) {
      const r = intersection(i.rectangles[a], i.rectangles[b]),
        area = r[2] * r[3];
      if (area > 0)
        pairs.push({ leftIndex: a, rightIndex: b, overlapArea: area });
    }
  return { pairs };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    rectangles: [
      [0, 0, 2, 2],
      [1, 1, 2, 2],
    ],
  },
  output: {
    result: { pairs: [{ leftIndex: 0, rightIndex: 1, overlapArea: 1 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/layout-rectangle-overlap-pairs",
  title: "Layout Rectangle Overlap Pairs",
  description:
    "List unique unordered rectangle pairs with positive overlap area; edge touching, z-order and occlusion are not counted as area overlap.",
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
          pairs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                leftIndex: { type: "number" },
                rightIndex: { type: "number" },
                overlapArea: { type: "number" },
              },
              required: ["leftIndex", "rightIndex", "overlapArea"],
            },
          },
        },
        required: ["pairs"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
