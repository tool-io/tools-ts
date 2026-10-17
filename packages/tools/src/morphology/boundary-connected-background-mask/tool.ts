import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  mask: readonly (readonly number[])[];
  eight: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mask", label: "mask", kind: "matrix" },
  { id: "eight", label: "eight", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const c = H.components(i.mask, i.eight, 0),
    h = i.mask.length,
    w = i.mask[0]?.length ?? 0;
  const boundary = new Set(
    c.cells.flatMap((cells, j) =>
      cells.some(([y, x]) => y === 0 || x === 0 || y === h - 1 || x === w - 1)
        ? [j + 1]
        : [],
    ),
  );
  return H.finish({
    mask: c.labels.map((row) => row.map((x) => Number(boundary.has(x)))),
  });
};
export const example = {
  input: {
    mask: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    eight: false,
  },
  output: {
    result: {
      mask: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Binary Mask Boundary Connected Background Mask",
      "image morphology",
      "image processing",
    ],
    collections: ["data", "learn"],
    fields: ["morphology", "image morphology", "image processing"],
    keywords: ["image morphology", "image processing"],
  },
  id: "morphology/boundary-connected-background-mask",
  title: "Binary Mask Boundary Connected Background Mask",
  description:
    "Select background components connected to the explicit finite mask boundary under chosen four/eight connectivity; no infinite-image topology inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
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
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
