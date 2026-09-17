import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ matrices: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrices", label: "matrices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  let current = [1, 0, 0, 1, 0, 0];
  return H.finish({
    prefixes: i.matrices.map((m) => {
      current = H.affineCompose(current, m);
      return [...current];
    }),
  });
};
export const example = {
  input: {
    matrices: [
      [1, 0, 0, 1, 1, 2],
      [2, 0, 0, 3, 0, 0],
    ],
  },
  output: {
    result: {
      prefixes: [
        [1, 0, 0, 1, 1, 2],
        [2, 0, 0, 3, 2, 6],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "affine/matrix-chain-prefix-records",
  title: "Affine Matrix Chain Prefix Records",
  description:
    "Affine six-coefficient layout [a,b,c,d,e,f] maps x,y to a*x+c*y+e,b*x+d*y+f; accumulate transform-chain prefixes in first-then-next order, preserving each composed state without mutating input.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
