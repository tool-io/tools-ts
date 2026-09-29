import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  cantileverThickness: number;
  length: number;
  tipDeflection: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cantileverThickness", label: "Cantilever thickness", kind: "number" },
  { id: "length", label: "Length", kind: "number" },
  { id: "tipDeflection", label: "Tip deflection", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.cantileverThickness);
  H.positive(i.length);
  H.bounded(i.tipDeflection, 0, i.length / 10);
  return H.finish({
    maximumSurfaceStrain:
      (1.5 * i.cantileverThickness * i.tipDeflection) / i.length ** 2,
  });
};
export const example = {
  input: { cantileverThickness: 2, length: 20, tipDeflection: 1 },
  output: { result: { maximumSurfaceStrain: 0.0075 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "industrial-design/snap-fit-deflection-strain-explicit-geometry",
  title: "Industrial Design: Snap Fit Deflection Strain Explicit Geometry Tool",
  description:
    "Evaluate the small-deflection uniform cantilever snap-fit outer-fiber strain approximation 3*t*delta/(2*L^2); no stress concentration, material limit or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { maximumSurfaceStrain: { type: "number" } },
        required: ["maximumSurfaceStrain"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
