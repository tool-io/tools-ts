import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
  t: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
  { id: "t", label: "t", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ quaternion: H.qInterpolate(i.left, i.right, i.t, true) });
};
export const example = {
  input: { left: [1, 0, 0, 0], right: [-1, 0, 0, 0], t: 0.5 },
  output: { result: { quaternion: [1, 0, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Unit Quaternion Short Arc SLERP", "quaternions", "3D rotations"],
    collections: ["data", "learn"],
    fields: ["quaternion", "quaternions", "3D rotations"],
    keywords: ["quaternions", "3D rotations"],
  },
  id: "quaternion/unit-short-arc-slerp",
  title: "Unit Quaternion Short Arc SLERP",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; perform shortest-sign spherical interpolation with normalized linear fallback for near-identical inputs on the closed unit t domain; antipodal spelling is corrected, not interpolated through zero.",
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
          quaternion: { type: "array", items: { type: "number" } },
        },
        required: ["quaternion"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
