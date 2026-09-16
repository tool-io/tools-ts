import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  width: number;
  height: number;
  gap: number;
  length: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", kind: "number", label: "width" },
  { id: "height", kind: "number", label: "height" },
  { id: "gap", kind: "number", label: "gap" },
  { id: "length", kind: "number", label: "length" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.width);
  H.positive(i.height);
  H.check(i.gap >= 0);
  H.positive(i.length);
  const g = i.gap,
    l = i.length,
    w = i.width,
    h = i.height;
  return H.finish({
    segments: [
      [-g - l, 0, -g, 0],
      [w + g, 0, w + g + l, 0],
      [-g - l, h, -g, h],
      [w + g, h, w + g + l, h],
      [0, -g - l, 0, -g],
      [w, -g - l, w, -g],
      [0, h + g, 0, h + g + l],
      [w, h + g, w, h + g + l],
    ],
  });
};
export const example = {
  input: { width: 10, height: 8, gap: 1, length: 2 },
  output: {
    result: {
      segments: [
        [-3, 0, -1, 0],
        [11, 0, 13, 0],
        [-3, 8, -1, 8],
        [11, 8, 13, 8],
        [0, -3, 0, -1],
        [10, -3, 10, -1],
        [0, 9, 0, 11],
        [10, 9, 10, 11],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-crop-mark-endpoints",
  title: "Print Crop Mark Endpoints",
  description:
    "Place eight axis-aligned crop-mark segments outside a rectangular trim box at the origin with explicit gap and length.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
