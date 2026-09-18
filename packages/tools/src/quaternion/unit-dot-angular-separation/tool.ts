import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  left: readonly number[];
  right: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "left", kind: "numberList" },
  { id: "right", label: "right", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.qUnit(i.left);
  H.qUnit(i.right);
  return H.finish({
    radians:
      2 *
      Math.acos(
        Math.max(
          0,
          Math.min(
            1,
            Math.abs(i.left.reduce((s, x, j) => s + x * i.right[j], 0)),
          ),
        ),
      ),
  });
};
export const example = {
  input: { left: [1, 0, 0, 0], right: [0, 1, 0, 0] },
  output: { result: { radians: 3.141592653589793 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/unit-dot-angular-separation",
  title: "Unit Quaternion Angular Separation",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; measure shortest rotation separation through absolute unit dot product, treating q and -q as identical.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
