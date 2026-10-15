import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  startLatitudeDegrees: number;
  startLongitudeDegrees: number;
  endLatitudeDegrees: number;
  endLongitudeDegrees: number;
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
    id: "startLatitudeDegrees",
    label: "Start latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "startLongitudeDegrees",
    label: "Start longitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "endLatitudeDegrees",
    label: "End latitude degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "endLongitudeDegrees",
    label: "End longitude degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi1 = H.latitude(i.startLatitudeDegrees),
    phi2 = H.latitude(i.endLatitudeDegrees),
    lambda1 = H.longitude(i.startLongitudeDegrees),
    lambda2 = H.longitude(i.endLongitudeDegrees);
  return H.finish(H.vincentyInverse(p.a, p.f, phi1, lambda1, phi2, lambda2));
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    startLatitudeDegrees: 0,
    startLongitudeDegrees: 0,
    endLatitudeDegrees: 0,
    endLongitudeDegrees: 90,
  },
  output: {
    result: {
      converged: true,
      iterations: 1,
      distanceMeters: 15.707963267948966,
      initialBearingDegrees: 90,
      finalBearingDegrees: 90,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Vincenty Inverse Geodesic Calculator",
      "Geodetic Inverse Problem Vincenty Inverse Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/vincenty-inverse-distance-bearing",
  title: "Vincenty Inverse Geodesic Calculator",
  description:
    "Solve Vincenty inverse distance and forward endpoint bearings with a 200-iteration cap; near-antipodal failure returns null distances, never a fabricated spherical fallback.",
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
          distanceMeters: { anyOf: [{ type: "number" }, { type: "null" }] },
          initialBearingDegrees: {
            anyOf: [{ type: "number" }, { type: "null" }],
          },
          finalBearingDegrees: {
            anyOf: [{ type: "number" }, { type: "null" }],
          },
          reason: { type: "string" },
        },
        required: [
          "converged",
          "iterations",
          "distanceMeters",
          "initialBearingDegrees",
          "finalBearingDegrees",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
