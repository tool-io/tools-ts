import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  center: readonly number[];
  size: number;
  pointy: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "center", label: "center", kind: "numberList" },
  { id: "size", label: "size", kind: "number" },
  { id: "pointy", label: "pointy", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.point(i.center);
  H.positive(i.size);
  return H.finish({
    corners: Array.from({ length: 6 }, (_, j) => {
      const a = (i.pointy ? Math.PI / 6 : 0) + (j * Math.PI) / 3;
      return [
        i.center[0] + i.size * Math.cos(a),
        i.center[1] + i.size * Math.sin(a),
      ];
    }),
  });
};
export const example = {
  input: { center: [0, 0], size: 1, pointy: false },
  output: {
    result: {
      corners: [
        [1.0, 0.0],
        [0.5000000000000001, 0.8660254037844386],
        [-0.4999999999999998, 0.8660254037844387],
        [-1.0, 1.2246467991473532e-16],
        [-0.5000000000000004, -0.8660254037844384],
        [0.5000000000000001, -0.8660254037844386],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "hex/hex-corner-coordinate-list",
  title: "Hex Corner Coordinate List",
  description:
    "Enumerate six Cartesian regular-hex corners at an explicit center and circumradius; angle zero for flat, thirty degrees for pointy, mathematical positive-y coordinates.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
