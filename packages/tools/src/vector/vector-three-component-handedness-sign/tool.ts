import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  first: readonly number[];
  second: readonly number[];
  third: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "first", label: "First", kind: "numberList" },
  { id: "second", label: "Second", kind: "numberList" },
  { id: "third", label: "Third", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check([i.first, i.second, i.third].every((v) => v.length === 3));
  const [a, b, c] = [i.first, i.second, i.third],
    det =
      a[0] * (b[1] * c[2] - b[2] * c[1]) -
      a[1] * (b[0] * c[2] - b[2] * c[0]) +
      a[2] * (b[0] * c[1] - b[1] * c[0]);
  return H.finish({
    scalarTripleProduct: det,
    handedness: det === 0 ? "degenerate" : det > 0 ? "right" : "left",
  });
};
export const example = {
  input: { first: [1, 0, 0], second: [0, 1, 0], third: [0, 0, 1] },
  output: { result: { scalarTripleProduct: 1, handedness: "right" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vector/vector-three-component-handedness-sign",
  title: "Vector: Vector Three Component Handedness Sign Tool",
  description:
    "Determine handedness of an explicit ordered three-vector basis from its scalar triple product, with exact zero treated as degenerate and no orthogonality claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          handedness: { type: "string" },
          scalarTripleProduct: { type: "number" },
        },
        required: ["handedness", "scalarTripleProduct"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
