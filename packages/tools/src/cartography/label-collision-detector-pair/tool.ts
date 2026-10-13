import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, box } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly labelABoundsMm: readonly number[];
  readonly labelBBoundsMm: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "labelABoundsMm", label: "Label a bounds mm", kind: "numberList" },
  { id: "labelBBoundsMm", label: "Label b bounds mm", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  const a = box(i.labelABoundsMm),
    b = box(i.labelBBoundsMm),
    w = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])),
    h = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  return { overlapAreaMm2: w * h, positiveAreaCollision: w * h > 0 };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { labelABoundsMm: [0, 0, 3, 2], labelBBoundsMm: [2, 1, 4, 3] },
  output: { result: { overlapAreaMm2: 1, positiveAreaCollision: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/label-collision-detector-pair",
  title: "Label Placement Collision Overlap Detector Two Labels",
  description:
    "Pairwise axis-aligned rectangular label collision area; glyph contours, rotations and global placement omitted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          overlapAreaMm2: { type: "number" },
          positiveAreaCollision: { type: "boolean" },
        },
        required: ["overlapAreaMm2", "positiveAreaCollision"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
