import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
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
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees, false);
  return H.finish({ isometricLatitude: H.isometric(p.f, phi) });
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, latitudeDegrees: 0 },
  output: { result: { isometricLatitude: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Isometric Latitude Computation Calculator", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/isometric-latitude-computation",
  title: "Isometric Latitude Computation Calculator",
  description:
    "Compute dimensionless ellipsoidal isometric latitude as asinh(tan(phi))-e*atanh(e*sin(phi)); poles are divergent and rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { isometricLatitude: { type: "number" } },
        required: ["isometricLatitude"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
