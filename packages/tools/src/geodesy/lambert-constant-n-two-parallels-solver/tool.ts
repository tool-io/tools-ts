import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  firstParallelDegrees: number;
  secondParallelDegrees: number;
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
    id: "firstParallelDegrees",
    label: "First parallel degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "secondParallelDegrees",
    label: "Second parallel degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi1 = H.latitude(i.firstParallelDegrees, false),
    phi2 = H.latitude(i.secondParallelDegrees, false),
    m1 = Math.cos(phi1) / Math.sqrt(1 - p.e2 * Math.sin(phi1) ** 2),
    m2 = Math.cos(phi2) / Math.sqrt(1 - p.e2 * Math.sin(phi2) ** 2);
  const n =
    phi1 === phi2
      ? Math.sin(phi1)
      : (Math.log(m1) - Math.log(m2)) /
        (H.isometric(p.f, phi2) - H.isometric(p.f, phi1));
  return H.finish({
    n,
    degenerate: Math.abs(n) < 1e-12,
    branch: phi1 === phi2 ? "tangent" : "secant",
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    firstParallelDegrees: 30,
    secondParallelDegrees: 30,
  },
  output: { result: { n: 0.5, degenerate: false, branch: "tangent" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/lambert-constant-n-two-parallels-solver",
  title: "Lambert Conformal Conic Constant n Solver from Two Parallels",
  description:
    "Compute Lambert conformal-conic cone constant from ellipsoidal m and isometric latitude at two parallels, using the tangent limit for identical parallels and marking degenerate n=0; not a complete LCC map.",
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
