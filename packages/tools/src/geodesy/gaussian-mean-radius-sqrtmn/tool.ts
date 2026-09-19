import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  { id: "flattening", label: "Flattening", kind: "number" },
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  const r = H.radii(p.a, p.f, phi);
  return H.finish({ radiusMeters: Math.sqrt(r.prime * r.meridian) });
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, latitudeDegrees: 30 },
  output: { result: { radiusMeters: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/gaussian-mean-radius-sqrtmn",
  title: "Gaussian Mean Curvature Radius sqrt(MN) Calculator",
  description:
    "Compute Gaussian mean curvature radius sqrt(M*N) from ellipsoid geometry at latitude, deriving both directional curvature radii rather than averaging caller numbers.",
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
