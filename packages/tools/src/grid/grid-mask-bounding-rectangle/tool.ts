import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, mask } from "../batch53-shared.js";

export type Input = Readonly<{ mask: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mask", label: "Mask", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  mask(i.mask);
  const cells = i.mask.flatMap((r, y) =>
    r.flatMap((v, x) => (v ? [[y, x]] : [])),
  );
  return {
    empty: !cells.length,
    bounds: cells.length
      ? {
          top: Math.min(...cells.map((c) => c[0])),
          left: Math.min(...cells.map((c) => c[1])),
          bottomExclusive: Math.max(...cells.map((c) => c[0])) + 1,
          rightExclusive: Math.max(...cells.map((c) => c[1])) + 1,
        }
      : null,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    mask: [
      [0, 1, 0],
      [0, 0, 1],
    ],
  },
  output: {
    result: {
      empty: false,
      bounds: { top: 0, left: 1, bottomExclusive: 2, rightExclusive: 3 },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/grid-mask-bounding-rectangle",
  title: "Grid Mask Bounding Rectangle",
  description:
    "Find the smallest half-open row/column bounding rectangle of set binary mask cells; an all-zero mask has no rectangle.",
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
          empty: { type: "boolean" },
          bounds: {
            anyOf: [
              {
                type: "object",
                additionalProperties: false,
                properties: {
                  top: { type: "number" },
                  left: { type: "number" },
                  bottomExclusive: { type: "number" },
                  rightExclusive: { type: "number" },
                },
                required: ["top", "left", "bottomExclusive", "rightExclusive"],
              },
              { type: "null" },
            ],
          },
        },
        required: ["empty", "bounds"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
