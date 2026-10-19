import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ quaternion: readonly number[]; scalar: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
  { id: "scalar", label: "scalar", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.quat(i.quaternion);
  return H.finish({ quaternion: i.quaternion.map((x) => x * i.scalar) });
};
export const example = {
  input: { quaternion: [1, 2, 3, 4], scalar: 2 },
  output: { result: { quaternion: [2, 4, 6, 8] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Quaternion Finite Scalar Scale", "quaternions", "3D rotations"],
    collections: ["data", "learn"],
    fields: ["quaternion", "quaternions", "3D rotations"],
    keywords: ["quaternions", "3D rotations"],
  },
  id: "quaternion/component-finite-scalar-scale",
  title: "Quaternion Finite Scalar Scale",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; scale finite quaternion components without claiming the result remains a unit rotation.",
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
