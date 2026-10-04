import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ coordinates: readonly number[]; kind: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinates", label: "Coordinates", kind: "numberList" },
  { id: "kind", label: "Kind", kind: "string", enum: ["point", "direction"] },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coordinates.length === 2 || i.coordinates.length === 3);
  H.choice(i.kind, ["point", "direction"]);
  return H.finish({
    homogeneous: [...i.coordinates, i.kind === "point" ? 1 : 0],
  });
};
export const example = {
  input: { coordinates: [1, 2, 3], kind: "direction" },
  output: { result: { homogeneous: [1, 2, 3, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vector/vector-affine-point-direction-tag",
  title: "Vector: Vector Affine Point Direction Tag Tool",
  description:
    "Encode a 2D/3D affine point or free direction into homogeneous coordinates with explicit final weight one or zero; no projective division.",
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
          homogeneous: { type: "array", items: { type: "number" } },
        },
        required: ["homogeneous"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
