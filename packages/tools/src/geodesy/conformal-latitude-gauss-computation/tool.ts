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
  return H.finish({
    conformalLatitudeDegrees: H.deg(
      Math.atan(Math.sinh(H.isometric(p.f, phi))),
    ),
  });
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, latitudeDegrees: 0 },
  output: { result: { conformalLatitudeDegrees: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Gauss Conformal Latitude Calculator",
      "Conformal Latitude Gauss Computation Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/conformal-latitude-gauss-computation",
  title: "Gauss Conformal Latitude Calculator",
  description:
    "Compute Gauss conformal latitude from ellipsoidal isometric latitude; finite nonpolar input only, no planar projection or datum conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conformalLatitudeDegrees: { type: "number" } },
        required: ["conformalLatitudeDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
