import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ matrix: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "matrix", label: "matrix", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.affine(i.matrix);
  const a = 1 - i.matrix[0],
    b = -i.matrix[2],
    c = -i.matrix[1],
    d = 1 - i.matrix[3],
    e = i.matrix[4],
    f = i.matrix[5],
    det = a * d - b * c;
  H.check(det !== 0);
  return H.finish({ point: [(d * e - b * f) / det, (a * f - c * e) / det] });
};
export const example = {
  input: { matrix: [2, 0, 0, 2, 1, 1] },
  output: { result: { point: [-1, -1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Affine Fixed Point Solve",
      "affine transformations",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["affine", "affine transformations", "mathematics"],
    keywords: ["affine transformations", "mathematics"],
  },
  id: "affine/matrix-fixed-point-solve",
  title: "Affine Fixed Point Solve",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; solve the unique fixed point of a nonsingular I-linear block; nonunique/no-solution singular systems reject, not guessed.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { point: { type: "array", items: { type: "number" } } },
        required: ["point"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
