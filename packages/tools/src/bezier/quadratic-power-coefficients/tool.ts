import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ points: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "points", label: "points", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.curve(i.points, 2);
  return H.finish({ points: H.bezierPower(i.points) });
};
export const example = {
  input: {
    points: [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
  },
  output: {
    result: {
      points: [
        [0, 0],
        [2, 2],
        [0, -2],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bezier/quadratic-power-coefficients",
  title: "Quadratic Bezier Power Coefficients",
  description:
    "Convert planar Bezier control points to ascending power coefficients for explicit degree 2; exact linear basis change under finite arithmetic.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
