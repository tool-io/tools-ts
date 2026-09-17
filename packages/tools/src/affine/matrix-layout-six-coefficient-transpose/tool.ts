import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ coefficients: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.affine(i.coefficients);
  return H.finish({
    rowMajor: [
      i.coefficients[0],
      i.coefficients[2],
      i.coefficients[4],
      i.coefficients[1],
      i.coefficients[3],
      i.coefficients[5],
    ],
  });
};
export const example = {
  input: { coefficients: [2, 0, 0, 3, 4, 5] },
  output: { result: { rowMajor: [2, 0, 4, 0, 3, 5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "affine/matrix-layout-six-coefficient-transpose",
  title: "Affine Six Coefficient Layout Converter",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; convert SVG-style compact coefficients to a 2x3 row-major six-element layout, not an arbitrary matrix transpose.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
