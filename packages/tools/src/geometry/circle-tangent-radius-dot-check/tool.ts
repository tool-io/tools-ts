import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  radiusVector: readonly number[];
  tangentVector: readonly number[];
  normalizedTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "radiusVector", label: "Radius vector", kind: "numberList" },
  { id: "tangentVector", label: "Tangent vector", kind: "numberList" },
  { id: "normalizedTolerance", label: "Normalized tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.radiusVector.length === 2 && i.tangentVector.length === 2);
  H.bounded(i.normalizedTolerance, 0, 1);
  const a = Math.hypot(...i.radiusVector),
    b = Math.hypot(...i.tangentVector);
  H.positive(a);
  H.positive(b);
  const dot = i.radiusVector.reduce(
    (s, x, j) => s + (x / a) * (i.tangentVector[j] / b),
    0,
  );
  return H.finish({
    normalizedDot: dot,
    tangentConsistent: Math.abs(dot) <= i.normalizedTolerance,
  });
};
export const example = {
  input: {
    radiusVector: [1, 0],
    tangentVector: [0, 2],
    normalizedTolerance: 1e-8,
  },
  output: { result: { normalizedDot: 0, tangentConsistent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geometry/circle-tangent-radius-dot-check",
  title: "Geometry: Circle Tangent Radius Dot Check Tool",
  description:
    "Check planar radius/tangent perpendicularity using a normalized dot product under supplied tolerance; neither vector may be zero.",
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
          normalizedDot: { type: "number" },
          tangentConsistent: { type: "boolean" },
        },
        required: ["normalizedDot", "tangentConsistent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
