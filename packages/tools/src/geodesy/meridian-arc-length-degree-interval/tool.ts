import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  startLatitudeDegrees: number;
  endLatitudeDegrees: number;
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
    id: "startLatitudeDegrees",
    label: "Start latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "endLatitudeDegrees",
    label: "End latitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const start = H.latitude(i.startLatitudeDegrees),
    end = H.latitude(i.endLatitudeDegrees);
  return H.finish({
    signedDistanceMeters:
      H.meridianArc(p.a, p.f, end) - H.meridianArc(p.a, p.f, start),
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    startLatitudeDegrees: 0,
    endLatitudeDegrees: 30,
  },
  output: { result: { signedDistanceMeters: 5.235987755982989 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/meridian-arc-length-degree-interval",
  title: "Meridian Arc Length Degree Interval Calculator",
  description:
    "Compute signed ellipsoidal meridian distance between explicit geodetic latitudes by bounded numerical quadrature; northward positive, longitude irrelevant.",
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
