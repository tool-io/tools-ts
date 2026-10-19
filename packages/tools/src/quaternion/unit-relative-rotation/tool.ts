import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  from: readonly number[];
  to: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "from", label: "from", kind: "numberList" },
  { id: "to", label: "to", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.qUnit(i.from);
  H.qUnit(i.to);
  return H.finish({
    quaternion: H.qNorm(H.qProduct(i.to, H.qConjugate(i.from))),
  });
};
export const example = {
  input: { from: [1, 0, 0, 0], to: [0, 1, 0, 0] },
  output: { result: { quaternion: [0, 1, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Quaternion Unit Relative Rotation",
      "quaternions",
      "3D rotations",
    ],
    collections: ["data", "learn"],
    fields: ["quaternion", "quaternions", "3D rotations"],
    keywords: ["quaternions", "3D rotations"],
  },
  id: "quaternion/unit-relative-rotation",
  title: "Quaternion Unit Relative Rotation",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; compute the relative active rotation to * conjugate(from), normalized to remove numerical drift.",
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
