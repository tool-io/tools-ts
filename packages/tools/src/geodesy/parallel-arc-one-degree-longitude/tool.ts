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
    metersPerDegreeLongitude:
      Math.abs(i.latitudeDegrees) === 90
        ? 0
        : (H.radii(p.a, p.f, phi).prime * Math.cos(phi) * Math.PI) / 180,
  });
};
export const example = {
  input: { semiMajorMeters: 10, flattening: 0, latitudeDegrees: 0 },
  output: { result: { metersPerDegreeLongitude: 0.17453292519943295 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/parallel-arc-one-degree-longitude",
  title: "Parallel Arc Length One Degree Longitude Calculator",
  description:
    "Compute one-degree parallel arc from local prime-vertical radius and geodetic latitude, zero at poles; not a fixed spherical longitude conversion.",
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
