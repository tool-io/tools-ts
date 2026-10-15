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
    id: "longitudeDifferenceDegrees",
    label: "Longitude difference degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "centralScale", label: "Central scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
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
    gridConvergenceDegrees: H.deg(
      dl * Math.sin(phi) +
        (dl ** 3 / 3) *
          Math.sin(phi) *
          Math.cos(phi) ** 2 *
          (1 + 3 * C + 2 * C * C),
    ),
    order: "longitude series through deltaLambda^3",
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
    result: {
      gridConvergenceDegrees: 0,
      order: "longitude series through deltaLambda^3",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["UTM Grid Convergence Angle gamma Calculator", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/utm-grid-convergence-angle-gamma",
  title: "UTM Grid Convergence Angle gamma Calculator",
  description:
    "Estimate ellipsoidal TM grid convergence through cubic longitude terms within +/-3 degrees of the central meridian; positive east-of-central in the northern hemisphere, not a full projection solver.",
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
          gridConvergenceDegrees: { type: "number" },
          order: { type: "string" },
        },
        required: ["gridConvergenceDegrees", "order"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
