import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  groundDistanceMeters: number;
  ellipsoidalHeightMeters: number;
  curvatureRadiusMeters: number;
  projectionPointScale: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "groundDistanceMeters",
    label: "Ground distance meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "ellipsoidalHeightMeters",
    label: "Ellipsoidal height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "curvatureRadiusMeters",
    label: "Curvature radius meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "projectionPointScale",
    label: "Projection point scale",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.groundDistanceMeters >= 0 &&
      i.groundDistanceMeters <= 1e6 &&
      Math.abs(i.ellipsoidalHeightMeters) <= 1e5 &&
      i.curvatureRadiusMeters >= 1e6 &&
      i.curvatureRadiusMeters <= 1e7 &&
      i.projectionPointScale > 0 &&
      i.projectionPointScale <= 2,
  );
  const ef =
      i.curvatureRadiusMeters /
      (i.curvatureRadiusMeters + i.ellipsoidalHeightMeters),
    cf = ef * i.projectionPointScale;
  return H.finish({
    elevationFactor: ef,
    combinedFactor: cf,
    gridDistanceMeters: i.groundDistanceMeters * cf,
  });
};
export const example = {
  input: {
    groundDistanceMeters: 1000,
    ellipsoidalHeightMeters: 100,
    curvatureRadiusMeters: 1000000,
    projectionPointScale: 1,
  },
  output: {
    result: {
      elevationFactor: 0.9999000099990001,
      combinedFactor: 0.9999000099990001,
      gridDistanceMeters: 999.9000099990001,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/state-plane-combined-factor-ground-grid",
  title: "State Plane Combined Factor Ground-to-Grid Calculator",
  description:
    "Apply a caller-established State Plane point scale times approximate R/(R+h) elevation reduction to ground length; requires compatible ellipsoidal height/radius, not automatic State Plane/datum lookup.",
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
