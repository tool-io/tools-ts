import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
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
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  return H.finish({
    geocentricLatitudeDegrees: H.deg(
      Math.atan2((1 - p.e2) * Math.sin(phi), Math.cos(phi)),
    ),
  });
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, latitudeDegrees: 30 },
  output: { result: { geocentricLatitudeDegrees: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/geodetic-to-geocentric-latitude",
  title: "Geodetic to Geocentric Latitude Converter",
  description:
    "Convert geodetic to geocentric latitude on the ellipsoid surface (height zero), not arbitrary elevated ECEF position; oblate f<=0.02.",
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
