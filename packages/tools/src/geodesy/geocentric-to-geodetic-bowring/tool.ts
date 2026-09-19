import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  geocentricLatitudeDegrees: number;
  geocentricRadiusMeters: number;
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
    id: "geocentricLatitudeDegrees",
    label: "Geocentric latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "geocentricRadiusMeters",
    label: "Geocentric radius meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const theta = H.latitude(i.geocentricLatitudeDegrees);
  H.check(
    i.geocentricRadiusMeters >= p.a / 2 && i.geocentricRadiusMeters <= 1e9,
  );
  return H.finish(
    H.reverseEcef(
      p.a,
      p.f,
      [
        i.geocentricRadiusMeters * Math.cos(theta),
        0,
        i.geocentricRadiusMeters * Math.sin(theta),
      ],
      true,
    ),
  );
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    geocentricLatitudeDegrees: 0,
    geocentricRadiusMeters: 10,
  },
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
  id: "geodesy/geocentric-to-geodetic-bowring",
  title: "Geocentric to Geodetic Latitude Converter Bowring Method",
  description:
    "Convert geocentric latitude plus radius using Bowring initialization and bounded refinement; returns geodetic latitude/height and ECEF residual, excluding deep-interior ambiguous normals.",
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
