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
  return H.finish({
    basis: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ].map((v) => H.qRotate(i.quaternion, v)),
  });
};
export const example = {
  input: { quaternion: [0, 0, 0, 1] },
  output: {
    result: {
      basis: [
        [-1, 0, 0],
        [0, -1, 0],
        [0, 0, 1],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/unit-basis-vector-images",
  title: "Unit Quaternion Basis Vector Images",
  description:
    "Quaternion order is scalar-first [w,x,y,z], Hamilton product and right-handed active rotations; return the three active basis-vector images as columns-as-vectors, not a transposed row-major matrix convention.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
