import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
  longitudeDegrees: number;
  ellipsoidalHeightMeters: number;
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
  {
    id: "longitudeDegrees",
    label: "Longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "ellipsoidalHeightMeters",
    label: "Ellipsoidal height meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  const lambda = H.longitude(i.longitudeDegrees);
  return H.finish({
    ecefMeters: H.forwardEcef(p.a, p.f, phi, lambda, i.ellipsoidalHeightMeters),
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    ellipsoidalHeightMeters: 0,
  },
  output: { result: { ecefMeters: [10, 0, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/ecef-from-geodetic-coordinates",
  title: "ECEF X-Y-Z from Geodetic Coordinates Calculator",
  description:
    "Convert explicit ellipsoidal geodetic coordinates to right-handed ECEF metres; latitude/longitude degrees, ellipsoidal height not orthometric height, no datum shift.",
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
