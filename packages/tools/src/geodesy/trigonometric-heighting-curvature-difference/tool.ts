import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  slantDistanceMeters: number;
  elevationDegrees: number;
  instrumentHeightMeters: number;
  targetHeightMeters: number;
  earthRadiusMeters: number;
  refractionCoefficient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "slantDistanceMeters",
    label: "Slant distance meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "elevationDegrees",
    label: "Elevation degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "instrumentHeightMeters",
    label: "Instrument height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "targetHeightMeters",
    label: "Target height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "earthRadiusMeters",
    label: "Earth radius meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "refractionCoefficient",
    label: "Refraction coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const angle = H.latitude(i.elevationDegrees, false);
  H.check(
    i.slantDistanceMeters >= 0 &&
      i.slantDistanceMeters <= 1e5 &&
      i.earthRadiusMeters >= 1e6 &&
      i.earthRadiusMeters <= 1e7 &&
      i.refractionCoefficient >= 0 &&
      i.refractionCoefficient < 1 &&
      Math.abs(i.instrumentHeightMeters) <= 100 &&
      Math.abs(i.targetHeightMeters) <= 100,
  );
  const d = i.slantDistanceMeters * Math.cos(angle),
    correction =
      ((1 - i.refractionCoefficient) * d * d) / (2 * i.earthRadiusMeters);
  return H.finish({
    horizontalDistanceMeters: d,
    heightDifferenceMeters:
      i.slantDistanceMeters * Math.sin(angle) +
      i.instrumentHeightMeters -
      i.targetHeightMeters +
      correction,
    curvatureRefractionMeters: correction,
  });
};
export const example = {
  input: {
    slantDistanceMeters: 1000,
    elevationDegrees: 0,
    instrumentHeightMeters: 1,
    targetHeightMeters: 1,
    earthRadiusMeters: 1000000,
    refractionCoefficient: 0,
  },
  output: {
    result: {
      horizontalDistanceMeters: 1000,
      heightDifferenceMeters: 0.5,
      curvatureRefractionMeters: 0.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/trigonometric-heighting-curvature-difference",
  title: "Trigonometric Heighting Difference Calculator with Earth Curvature",
  description:
    "Estimate trigonometric target-minus-station height from slant geometry, instrument/target heights and positive curvature/refraction term (1-k)D^2/(2R); local small-angle model, not full geodetic leveling.",
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
