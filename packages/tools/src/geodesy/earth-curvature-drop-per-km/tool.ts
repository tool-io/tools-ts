import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  horizontalDistanceKm: number;
  earthRadiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "horizontalDistanceKm",
    label: "Horizontal distance km",
    kind: "number",
    unit: "km",
  },
  {
    id: "earthRadiusMeters",
    label: "Earth radius meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.earthRadiusMeters >= 1e6 &&
      i.earthRadiusMeters <= 1e7 &&
      i.horizontalDistanceKm >= 0 &&
      i.horizontalDistanceKm <= 100,
  );
  const d = i.horizontalDistanceKm * 1000;
  return H.finish({
    dropBelowTangentMeters:
      (d * d) /
      (i.earthRadiusMeters +
        Math.sqrt(i.earthRadiusMeters * i.earthRadiusMeters - d * d)),
  });
};
export const example = {
  input: { horizontalDistanceKm: 1, earthRadiusMeters: 1000000 },
  output: { result: { dropBelowTangentMeters: 0.5000001250300556 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/earth-curvature-drop-per-km",
  title: "Earth Curvature Drop metres per km Calculator",
  description:
    "Compute exact spherical surface drop below a tangent plane at an explicit horizontal offset, not along-surface arc distance; no refraction and no ellipsoid/terrain prediction.",
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
