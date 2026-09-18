import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ axis: readonly number[]; radians: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "axis", label: "axis", kind: "numberList" },
  { id: "radians", label: "radians", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.axis.length === 3);
  const norm = Math.hypot(...i.axis);
  H.check(norm > 0 && Number.isFinite(norm));
  return H.finish({
    quaternion: [
      Math.cos(i.radians / 2),
      ...i.axis.map((x) => (x / norm) * Math.sin(i.radians / 2)),
    ],
  });
};
export const example = {
  input: { axis: [0, 0, 2], radians: 0 },
  output: { result: { quaternion: [1, 0, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/axis-angle-to-unit-record",
  title: "Axis Angle to Unit Quaternion Record",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; convert an explicit nonzero axis and angle to a unit quaternion; axis is normalized, radians are not silently clamped.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
