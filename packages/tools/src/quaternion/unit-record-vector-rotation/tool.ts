import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  quaternion: readonly number[];
  vector: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "quaternion", label: "quaternion", kind: "numberList" },
  { id: "vector", label: "vector", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ vector: H.qRotate(i.quaternion, i.vector) });
};
export const example = {
  input: { quaternion: [0, 0, 0, 1], vector: [1, 2, 3] },
  output: { result: { vector: [-1, -2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/unit-record-vector-rotation",
  title: "Unit Quaternion Vector Rotation",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; rotate a finite three-vector by a validated unit quaternion without applying translation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
