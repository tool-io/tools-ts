import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  quaternion: readonly number[];
  tolerance: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.quat(i.quaternion);
  H.check(i.tolerance >= 0);
  const norm = Math.hypot(...i.quaternion);
  return H.finish({ norm, unit: Math.abs(norm - 1) <= i.tolerance });
};
export const example = {
  input: { quaternion: [1, 0, 0, 0], tolerance: 0 },
  output: { result: { norm: 1, unit: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Quaternion Unit Validity Audit", "quaternions", "3D rotations"],
    collections: ["data", "learn"],
    fields: ["quaternion", "quaternions", "3D rotations"],
    keywords: ["quaternions", "3D rotations"],
  },
  id: "quaternion/unit-validity-audit",
  title: "Quaternion Unit Validity Audit",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; audit unit norm against an explicit nonnegative tolerance; finite components alone do not prove a rotation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { norm: { type: "number" }, unit: { type: "boolean" } },
        required: ["norm", "unit"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
