import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  ecefMeters: readonly number[];
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
  { id: "ecefMeters", label: "Ecef meters", kind: "numberList", unit: "m" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  return H.finish(H.reverseEcef(p.a, p.f, i.ecefMeters));
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, ecefMeters: [10, 0, 0] },
  output: {
    result: {
      latitudeDegrees: 0,
      longitudeDegrees: 0,
      ellipsoidalHeightMeters: 0,
      iterations: 1,
      residualMeters: 0,
      converged: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/geodetic-from-ecef-iterative-converter",
  title: "Geodetic from ECEF XYZ Iterative Converter",
  description:
    "Convert exterior/near-surface ECEF metres to geodetic latitude, longitude and ellipsoidal height with bounded iteration and explicit round-trip residual; excludes deep-interior ambiguous normals.",
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
