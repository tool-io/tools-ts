import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  matrix: readonly number[];
  translation: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
  { id: "translation", label: "translation", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.affine(i.matrix);
  H.point(i.translation);
  return H.finish({ matrix: [...i.matrix.slice(0, 4), ...i.translation] });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5], translation: [1, 2] },
  output: { result: { matrix: [2, 0, 0, 3, 1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "affine/matrix-translation-component-replace",
  title: "Affine Translation Component Replacement",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; replace only translation components, preserving the full original linear block.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
