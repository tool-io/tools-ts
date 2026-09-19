import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ coordinateMeters: number; scalePpm: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "coordinateMeters",
    label: "Coordinate meters",
    kind: "number",
    unit: "m",
  },
  { id: "scalePpm", label: "Scale ppm", kind: "number", unit: "ppm" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.magnitude(i.coordinateMeters);
  H.check(Math.abs(i.scalePpm) <= 1000);
  return H.finish({
    scaleFactor: 1 + i.scalePpm * 1e-6,
    scaledMeters: i.coordinateMeters * (1 + i.scalePpm * 1e-6),
    correctionMeters: i.coordinateMeters * i.scalePpm * 1e-6,
  });
};
export const example = {
  input: { coordinateMeters: 1000, scalePpm: 2 },
  output: {
    result: {
      scaleFactor: 1.000002,
      scaledMeters: 1000.002,
      correctionMeters: 0.002,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/helmert-scale-factor-correction",
  title: "Scale Factor ppm Correction in Helmert Applier",
  description:
    "Apply the signed Helmert scale convention k=1+ppm*1e-6 and expose its coordinate correction separately; not a full Helmert transform.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
