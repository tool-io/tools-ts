import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ quaternion: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ quaternion: H.qCanonical(i.quaternion) });
};
export const example = {
  input: { quaternion: [0, -1, 0, 0] },
  output: { result: { quaternion: [0, 1, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Quaternion Rotation Canonical Sign",
      "quaternions",
      "3D rotations",
    ],
    collections: ["data", "learn"],
    fields: ["quaternion", "quaternions", "3D rotations"],
    keywords: ["quaternions", "3D rotations"],
  },
  id: "quaternion/rotation-canonical-sign",
  title: "Quaternion Rotation Canonical Sign",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; canonicalize unit quaternion sign by the first nonzero component being positive, including half-turn scalar-zero cases.",
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
