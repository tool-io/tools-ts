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
  return H.finish({ quaternion: H.qConjugate(i.quaternion) });
};
export const example = {
  input: { quaternion: [1, 2, 3, 4] },
  output: { result: { quaternion: [1, -2, -3, -4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/conjugate-components",
  title: "Quaternion Conjugate Components",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; conjugate vector components without assuming a unit norm or taking an inverse.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
