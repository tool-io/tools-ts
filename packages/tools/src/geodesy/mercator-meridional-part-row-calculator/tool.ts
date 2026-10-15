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
  const phi = H.latitude(i.latitudeDegrees, false),
    psi = H.isometric(p.f, phi);
  return H.finish({
    northingMeters: p.a * psi,
    meridionalPartsArcminutes: H.deg(psi) * 60,
  });
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, latitudeDegrees: 0 },
  output: { result: { northingMeters: 0, meridionalPartsArcminutes: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Mercator Northing Meridional Part Table Row Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/mercator-meridional-part-row-calculator",
  title: "Mercator Northing Meridional Part Table Row Calculator",
  description:
    "Compute ellipsoidal Mercator northing relative to the equator and dimensionless-radian meridional parts expressed as arcminutes; excludes poles, false northing and scale factors.",
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
          northingMeters: { type: "number" },
          meridionalPartsArcminutes: { type: "number" },
        },
        required: ["northingMeters", "meridionalPartsArcminutes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
