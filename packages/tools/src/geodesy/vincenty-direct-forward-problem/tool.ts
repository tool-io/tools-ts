import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
  longitudeDegrees: number;
  initialBearingDegrees: number;
  distanceMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
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
    id: "initialBearingDegrees",
    label: "Initial bearing degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "distanceMeters", label: "Distance meters", kind: "number", unit: "m" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  const lambda = H.longitude(i.longitudeDegrees);
  H.check(i.initialBearingDegrees >= 0 && i.initialBearingDegrees < 360);
  return H.finish(
    H.vincentyDirect(
      p.a,
      p.f,
      phi,
      lambda,
      H.rad(i.initialBearingDegrees),
      i.distanceMeters,
    ),
  );
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    latitudeDegrees: 0,
    longitudeDegrees: 0,
    initialBearingDegrees: 90,
    distanceMeters: 15.707963267948966,
  },
  output: {
    result: {
      converged: true,
      iterations: 1,
      latitudeDegrees: 0,
      longitudeDegrees: 90,
      finalBearingDegrees: 90,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Vincenty Direct Geodesic Calculator",
      "Geodetic Forward Problem Vincenty Direct Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/vincenty-direct-forward-problem",
  title: "Vincenty Direct Geodesic Calculator",
  description:
    "Solve Vincenty direct geodesics on supplied oblate/spherical ellipsoids, bounded to 200 iterations and half-equatorial circumference; report forward end bearing and explicit nonconvergence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          converged: { type: "boolean" },
          iterations: { type: "integer" },
          latitudeDegrees: { anyOf: [{ type: "number" }, { type: "null" }] },
          longitudeDegrees: { anyOf: [{ type: "number" }, { type: "null" }] },
          finalBearingDegrees: {
            anyOf: [{ type: "number" }, { type: "null" }],
          },
        },
        required: [
          "converged",
          "iterations",
          "latitudeDegrees",
          "longitudeDegrees",
          "finalBearingDegrees",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
