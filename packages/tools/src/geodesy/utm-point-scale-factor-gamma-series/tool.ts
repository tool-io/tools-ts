import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
  longitudeDifferenceDegrees: number;
  centralScale: number;
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
    id: "longitudeDifferenceDegrees",
    label: "Longitude difference degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "centralScale", label: "Central scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  H.check(
    Math.abs(i.latitudeDegrees) <= 84 &&
      Math.abs(i.longitudeDifferenceDegrees) <= 3 &&
      i.centralScale > 0 &&
      i.centralScale <= 2,
  );
  const dl = H.rad(i.longitudeDifferenceDegrees),
    A = dl * Math.cos(phi),
    T = Math.tan(phi) ** 2,
    C = (p.e2 / (1 - p.e2)) * Math.cos(phi) ** 2;
  return H.finish({
    pointScale:
      i.centralScale *
      (1 +
        ((1 + C) * A * A) / 2 +
        ((5 - 4 * T + 42 * C + 13 * C * C - (28 * p.e2) / (1 - p.e2)) *
          A ** 4) /
          24),
    order: "longitude series through A^4",
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    latitudeDegrees: 0,
    longitudeDifferenceDegrees: 0,
    centralScale: 0.9996,
  },
  output: {
    result: { pointScale: 0.9996, order: "longitude series through A^4" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/utm-point-scale-factor-gamma-series",
  title: "UTM Point Scale Factor k0 Gamma Series Calculator",
  description:
    "Estimate ellipsoidal transverse-Mercator point scale with a fourth-order longitude series, limited to +/-3 degrees from the central meridian and |latitude|<=84; not a full global UTM engine.",
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
