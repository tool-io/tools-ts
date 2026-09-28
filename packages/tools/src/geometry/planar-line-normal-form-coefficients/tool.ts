import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  a: number;
  b: number;
  c: number;
  orientation: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "a", label: "A", kind: "number" },
  { id: "b", label: "B", kind: "number" },
  { id: "c", label: "C", kind: "number" },
  {
    id: "orientation",
    label: "Orientation",
    kind: "string",
    enum: ["preserve", "first-positive"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.orientation, ["preserve", "first-positive"]);
  const norm = Math.hypot(i.a, i.b);
  H.positive(norm);
  const sign =
    i.orientation === "first-positive" && (i.a < 0 || (i.a === 0 && i.b < 0))
      ? -1
      : 1;
  return H.finish({
    a: (sign * i.a) / norm,
    b: (sign * i.b) / norm,
    c: (sign * i.c) / norm,
  });
};
export const example = {
  input: { a: -3, b: -4, c: 10, orientation: "first-positive" },
  output: { result: { a: 0.6, b: 0.8, c: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/planar-line-normal-form-coefficients",
  title: "Geometry: Planar Line Normal Form Coefficients Tool",
  description:
    "Normalize ax+by+c=0 to a unit normal, either preserving its orientation or making the first nonzero normal coefficient positive.",
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
          a: { type: "number" },
          b: { type: "number" },
          c: { type: "number" },
        },
        required: ["a", "b", "c"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
