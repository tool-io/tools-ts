import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.rect(i.left);
  H.rect(i.right);
  const dx =
      i.right[0] > i.left[2]
        ? i.right[0] - i.left[2]
        : i.right[2] < i.left[0]
          ? i.right[2] - i.left[0]
          : 0,
    dy =
      i.right[1] > i.left[3]
        ? i.right[1] - i.left[3]
        : i.right[3] < i.left[1]
          ? i.right[3] - i.left[1]
          : 0;
  const overlap =
    Math.max(i.left[0], i.right[0]) < Math.min(i.left[2], i.right[2]) &&
    Math.max(i.left[1], i.right[1]) < Math.min(i.left[3], i.right[3]);
  const candidates = [
    [i.right[0] - i.left[2], 0],
    [i.right[2] - i.left[0], 0],
    [0, i.right[1] - i.left[3]],
    [0, i.right[3] - i.left[1]],
  ];
  const vector = overlap
    ? candidates.sort((a, b) => Math.hypot(...a) - Math.hypot(...b))[0]
    : [dx, dy];
  return H.finish({ vector, overlap });
};
export const example = {
  input: { left: [0, 0, 2, 2], right: [1, 1, 3, 3] },
  output: { result: { vector: [-1, 0], overlap: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Rectangle Minimum Separation Vector", "mathematics"],
    collections: ["data", "learn"],
    fields: ["geometry", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "geometry/rectangle-minimum-separation-vector",
  title: "Rectangle Minimum Separation Vector",
  description:
    "For disjoint rectangles return the shortest translation closing both axis gaps; for overlapping rectangles return a minimum axis escape translation, ties left/right/down/up in that order.",
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
          vector: { type: "array", items: { type: "number" } },
          overlap: { type: "boolean" },
        },
        required: ["vector", "overlap"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
