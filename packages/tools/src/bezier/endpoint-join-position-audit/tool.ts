import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly (readonly number[])[];
  right: readonly (readonly number[])[];
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "matrix" },
  { id: "right", label: "right", kind: "matrix" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.curve(i.left);
  H.curve(i.right);
  H.check(i.tolerance >= 0);
  const distance = Math.hypot(
    ...i.left.at(-1)!.map((x, j) => x - i.right[0][j]),
  );
  return H.finish({ distance, joined: distance <= i.tolerance });
};
export const example = {
  input: {
    left: [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
    right: [
      [2, 0],
      [3, 1],
      [4, 0],
    ],
    tolerance: 0,
  },
  output: { result: { distance: 0, joined: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bezier/endpoint-join-position-audit",
  title: "Bezier Endpoint Join Position Audit",
  description:
    "Audit endpoint positional continuity of two explicit planar Bezier segments against an absolute supplied tolerance; no tangent or curvature continuity inferred.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
