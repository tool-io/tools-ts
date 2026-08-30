import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, rad, norm, skyVector, skyAngles } from "../shared.js";

export type Input = Readonly<{
  readonly raDegrees: number;
  readonly decDegrees: number;
  readonly distanceParsecs: number;
  readonly raStarMotionMasPerYear: number;
  readonly decMotionMasPerYear: number;
  readonly radialKmPerSecond: number;
  readonly elapsedJulianYears: number;
}>;
export type Output = Readonly<{
  readonly propagatedRaDegrees: number;
  readonly propagatedDecDegrees: number;
  readonly propagatedDistanceParsecs: number;
}>;
export const calculate = (input: Input): Output => {
  const line = skyVector(input.raDegrees, input.decDegrees);
  positive(input.distanceParsecs, "distanceParsecs");
  const a = rad(input.raDegrees),
    d = rad(input.decDegrees),
    east = [-Math.sin(a), Math.cos(a), 0],
    north = [
      -Math.cos(a) * Math.sin(d),
      -Math.sin(a) * Math.sin(d),
      Math.cos(d),
    ],
    vr = (input.radialKmPerSecond * 31557600) / 3.0856775814913673e13,
    velocity = line.map(
      (v, i) =>
        v * vr +
        input.distanceParsecs *
          (east[i] * rad(input.raStarMotionMasPerYear / 3600000) +
            north[i] * rad(input.decMotionMasPerYear / 3600000)),
    ),
    position = line.map(
      (v, i) =>
        input.distanceParsecs * v + velocity[i] * input.elapsedJulianYears,
    ),
    angles = skyAngles(position);
  return {
    propagatedRaDegrees: angles[0],
    propagatedDecDegrees: angles[1],
    propagatedDistanceParsecs: norm(position),
  };
};
export const exampleInput = {
  raDegrees: 0,
  decDegrees: 0,
  distanceParsecs: 1,
  raStarMotionMasPerYear: 1000,
  decMotionMasPerYear: 0,
  radialKmPerSecond: 0,
  elapsedJulianYears: 1,
} satisfies Input;
export const exampleOutput = {
  propagatedRaDegrees: 0.00027777777777560146,
  propagatedDecDegrees: 0,
  propagatedDistanceParsecs: 1.0000000000117522,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/rectilinear-astrometric-epoch-propagation",
  title: "Rectilinear Astrometric Epoch Propagation",
  description:
    "Propagate a Cartesian constant-space-velocity astrometric state using RA* proper motion and Julian years; light-time, gravity and reference-frame precession are excluded.",
  inputs: [
    { id: "raDegrees", label: "Ra degrees", kind: "number" },
    { id: "decDegrees", label: "Dec degrees", kind: "number" },
    { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
    {
      id: "raStarMotionMasPerYear",
      label: "Ra star motion mas per year",
      kind: "number",
      description:
        "RA proper motion multiplied by cos(declination), not the unscaled RA angular derivative.",
    },
    {
      id: "decMotionMasPerYear",
      label: "Dec motion mas per year",
      kind: "number",
    },
    { id: "radialKmPerSecond", label: "Radial km per second", kind: "number" },
    { id: "elapsedJulianYears", label: "Elapsed julian years", kind: "number" },
  ],
  outputs: [
    {
      id: "propagatedRaDegrees",
      label: "Propagated ra degrees",
      kind: "number",
    },
    {
      id: "propagatedDecDegrees",
      label: "Propagated dec degrees",
      kind: "number",
    },
    {
      id: "propagatedDistanceParsecs",
      label: "Propagated distance parsecs",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      raDegrees: value.raDegrees as number,
      decDegrees: value.decDegrees as number,
      distanceParsecs: value.distanceParsecs as number,
      raStarMotionMasPerYear: value.raStarMotionMasPerYear as number,
      decMotionMasPerYear: value.decMotionMasPerYear as number,
      radialKmPerSecond: value.radialKmPerSecond as number,
      elapsedJulianYears: value.elapsedJulianYears as number,
    }),
});
export const run = tool.execute;
export default tool;
