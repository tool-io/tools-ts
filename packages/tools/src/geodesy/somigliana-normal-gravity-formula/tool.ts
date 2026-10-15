import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
  equatorialGravity: number;
  polarGravity: number;
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
  { id: "equatorialGravity", label: "Equatorial gravity", kind: "number" },
  { id: "polarGravity", label: "Polar gravity", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  H.check(
    i.equatorialGravity > 0 &&
      i.equatorialGravity <= 100 &&
      i.polarGravity > 0 &&
      i.polarGravity <= 100,
  );
  const s = Math.sin(phi),
    r = 1 - p.f;
  return H.finish({
    gravityMetersPerSecondSquared:
      (i.equatorialGravity * (1 - s * s) + r * i.polarGravity * s * s) /
      Math.sqrt(1 - p.e2 * s * s),
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    latitudeDegrees: 0,
    equatorialGravity: 9.8,
    polarGravity: 9.9,
  },
  output: { result: { gravityMetersPerSecondSquared: 9.8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Somigliana Normal Gravity Calculator",
      "Somigliana Normal Gravity Theoretical Formula Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/somigliana-normal-gravity-formula",
  title: "Somigliana Normal Gravity Calculator",
  description:
    "Evaluate Somigliana normal gravity from an explicit ellipsoid and matching equatorial/polar normal-gravity constants in m/s^2; not observed gravity, altitude correction or a mixed-datum model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { gravityMetersPerSecondSquared: { type: "number" } },
        required: ["gravityMetersPerSecondSquared"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
