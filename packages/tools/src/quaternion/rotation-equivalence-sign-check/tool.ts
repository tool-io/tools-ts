import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
  { id: "tolerance", label: "tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.qUnit(i.left);
  H.qUnit(i.right);
  H.check(i.tolerance >= 0);
  return H.finish({
    equivalent:
      Math.min(
        Math.hypot(...i.left.map((x, j) => x - i.right[j])),
        Math.hypot(...i.left.map((x, j) => x + i.right[j])),
      ) <= i.tolerance,
  });
};
export const example = {
  input: { left: [1, 0, 0, 0], right: [-1, 0, 0, 0], tolerance: 0 },
  output: { result: { equivalent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/rotation-equivalence-sign-check",
  title: "Quaternion Rotation Sign Equivalence Check",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; compare unit rotations under q and -q sign equivalence using explicit component-space tolerance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
