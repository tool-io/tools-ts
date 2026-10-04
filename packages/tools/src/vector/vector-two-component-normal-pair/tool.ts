import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ vector: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "vector", label: "Vector", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.vector.length === 2);
  const n = Math.hypot(...i.vector);
  H.positive(n);
  return H.finish({
    leftUnitNormal: [-i.vector[1] / n, i.vector[0] / n],
    rightUnitNormal: [i.vector[1] / n, -i.vector[0] / n],
  });
};
export const example = {
  input: { vector: [3, 4] },
  output: {
    result: { leftUnitNormal: [-0.8, 0.6], rightUnitNormal: [0.8, -0.6] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vector/vector-two-component-normal-pair",
  title: "Vector: Vector Two Component Normal Pair Tool",
  description:
    "Return both oriented unit planar normals of a nonzero two-component vector under a Cartesian y-up convention.",
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
          leftUnitNormal: { type: "array", items: { type: "number" } },
          rightUnitNormal: { type: "array", items: { type: "number" } },
        },
        required: ["leftUnitNormal", "rightUnitNormal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
