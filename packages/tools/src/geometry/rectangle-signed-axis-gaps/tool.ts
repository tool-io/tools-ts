import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.rect(i.left);
  H.rect(i.right);
  return H.finish({
    gaps: [
      Math.max(i.right[0] - i.left[2], i.left[0] - i.right[2]),
      Math.max(i.right[1] - i.left[3], i.left[1] - i.right[3]),
    ],
  });
};
export const example = {
  input: { left: [0, 0, 2, 2], right: [1, 3, 4, 4] },
  output: { result: { gaps: [-1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/rectangle-signed-axis-gaps",
  title: "Rectangle Signed Axis Gaps",
  description:
    "Return signed rectangle axis gaps: positive separation, zero contact, negative overlap depth on each axis; no Euclidean distance inferred.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
