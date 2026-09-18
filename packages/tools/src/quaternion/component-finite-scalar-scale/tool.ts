import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ quaternion: readonly number[]; scalar: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
  { id: "scalar", label: "scalar", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.quat(i.quaternion);
  return H.finish({ quaternion: i.quaternion.map((x) => x * i.scalar) });
};
export const example = {
  input: { quaternion: [1, 2, 3, 4], scalar: 2 },
  output: { result: { quaternion: [2, 4, 6, 8] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/component-finite-scalar-scale",
  title: "Quaternion Finite Scalar Scale",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; scale finite quaternion components without claiming the result remains a unit rotation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
