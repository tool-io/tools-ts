import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  centerLatitudeDegrees: number;
  centerLongitudeDegrees: number;
  latitudeDegrees: number;
  longitudeDegrees: number;
  radiusMeters: number;
  relativeTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "centerLatitudeDegrees",
    label: "Center latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "centerLongitudeDegrees",
    label: "Center longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "radiusMeters", label: "Radius meters", kind: "number", unit: "m" },
  { id: "relativeTolerance", label: "Relative tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const phi0 = H.latitude(i.centerLatitudeDegrees),
    lam0 = H.longitude(i.centerLongitudeDegrees),
    phi = H.latitude(i.latitudeDegrees),
    lam = H.longitude(i.longitudeDegrees);
  H.check(
    i.radiusMeters >= 1 &&
      i.radiusMeters <= 1e8 &&
      i.relativeTolerance >= 0 &&
      i.relativeTolerance <= 0.1,
  );
  const xy = H.aeqd(phi0, lam0, phi, lam, i.radiusMeters),
    distance = i.radiusMeters * H.sphericalAngle(phi0, lam0, phi, lam),
    radius = Math.hypot(...xy),
    error = distance === 0 ? radius : Math.abs(radius - distance) / distance;
  return H.finish({
    projectedMeters: xy,
    greatCircleDistanceMeters: distance,
    radialDistanceMeters: radius,
    relativeError: error,
    withinTolerance: error <= i.relativeTolerance,
  });
};
export const example = {
  input: {
    centerLatitudeDegrees: 0,
    centerLongitudeDegrees: 0,
    latitudeDegrees: 0,
    longitudeDegrees: 90,
    radiusMeters: 1,
    relativeTolerance: 1e-10,
  },
  output: {
    result: {
      projectedMeters: [1.5707963267948966, 0],
      greatCircleDistanceMeters: 1.5707963267948966,
      radialDistanceMeters: 1.5707963267948966,
      relativeError: 0,
      withinTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/azimuthal-equidistant-center-property-checker",
  title: "Azimuthal Equidistant Distance Truth Center Property Checker",
  description:
    "Project a point with spherical azimuthal-equidistant equations and compare its planar radius with center-to-point great-circle distance; antipodes rejected, does not preserve distances between arbitrary noncentral points.",
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
