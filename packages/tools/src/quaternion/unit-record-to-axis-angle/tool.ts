import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ quaternion: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const q = H.qCanonical(i.quaternion),
    n = Math.hypot(...q.slice(1));
  return H.finish({
    radians: 2 * Math.atan2(n, Math.max(0, q[0])),
    axis: n === 0 ? null : q.slice(1).map((x) => x / n),
  });
};
export const example = {
  input: { quaternion: [1, 0, 0, 0] },
  output: { result: { radians: 0, axis: null } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/unit-record-to-axis-angle",
  title: "Unit Quaternion Record to Axis Angle",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; convert a unit rotation to canonical shortest axis-angle; zero rotation has an unknown/null axis, not an invented direction.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
