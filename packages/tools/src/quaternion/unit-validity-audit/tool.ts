import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  quaternion: readonly number[];
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
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
  id: "quaternion/unit-validity-audit",
  title: "Quaternion Unit Validity Audit",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; audit unit norm against an explicit nonnegative tolerance; finite components alone do not prove a rotation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
