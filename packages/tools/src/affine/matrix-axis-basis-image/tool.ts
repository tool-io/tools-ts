import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ matrix: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.affine(i.matrix);
  return H.finish({
    origin: [i.matrix[4], i.matrix[5]],
    xBasis: [i.matrix[0], i.matrix[1]],
    yBasis: [i.matrix[2], i.matrix[3]],
  });
};
export const example = {
  input: { matrix: [2, 0, 0, 3, 4, 5] },
  output: { result: { origin: [4, 5], xBasis: [2, 0], yBasis: [0, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "affine/matrix-axis-basis-image",
  title: "Affine Axis Basis Image",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; expose origin image and linear basis-vector images separately, avoiding translation contamination of displacement axes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
