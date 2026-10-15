import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  latitudeDegrees: number;
  longitudeDifferenceDegrees: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
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
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const phi = H.latitude(i.latitudeDegrees),
    dl = H.rad(i.longitudeDifferenceDegrees);
  H.check(
    Math.abs(i.latitudeDegrees) <= 85 &&
      Math.abs(i.longitudeDifferenceDegrees) <= 30,
  );
  const den = 1 - Math.cos(phi) ** 2 * Math.sin(dl) ** 2,
    dx = (-Math.sin(phi) * Math.sin(dl)) / Math.sqrt(den),
    dy = Math.cos(dl) / den;
  return H.finish({
    meridianScale: Math.hypot(dx, dy),
    onCentralMeridian: i.longitudeDifferenceDegrees === 0,
    model: "spherical Cassini-Soldner differential",
  });
};
export const example = {
  input: { latitudeDegrees: 0, longitudeDifferenceDegrees: 0 },
  output: {
    result: {
      meridianScale: 1,
      onCentralMeridian: true,
      model: "spherical Cassini-Soldner differential",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Cassini-Soldner Transverse Scale Along Meridian Checker",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/cassini-soldner-meridian-scale-checker",
  title: "Cassini-Soldner Transverse Scale Along Meridian Checker",
  description:
    "Check spherical Cassini-Soldner meridian differential scale from analytical forward-map derivatives, unity on the central meridian; restricted to +/-30 degrees longitude and |latitude|<=85, not ellipsoidal Cassini accuracy.",
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
          meridianScale: { type: "number" },
          onCentralMeridian: { type: "boolean" },
          model: { type: "string" },
        },
        required: ["meridianScale", "onCentralMeridian", "model"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
