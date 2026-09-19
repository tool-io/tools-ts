import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  signedArcMeters: number;
  toleranceMeters: number;
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
    id: "signedArcMeters",
    label: "Signed arc meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "toleranceMeters",
    label: "Tolerance meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  return H.finish(
    H.inverseMeridian(p.a, p.f, i.signedArcMeters, i.toleranceMeters),
  );
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    signedArcMeters: 0,
    toleranceMeters: 1e-7,
  },
  output: {
    result: {
      latitudeDegrees: 0,
      residualMeters: 0,
      iterations: 1,
      converged: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/meridian-arc-inverse-solver",
  title: "Meridian Arc Length Inverse Problem Solver",
  description:
    "Invert signed equator-referenced meridian distance within the polar quadrants using at most 64 bisections and explicit residual/convergence, not an arbitrary along-path inverse.",
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
