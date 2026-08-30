import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import {
  positive,
  rad,
  skyVector,
  matrixVector,
  galacticRotation,
} from "../shared.js";

export type Input = Readonly<{
  readonly raDegrees: number;
  readonly decDegrees: number;
  readonly distanceParsecs: number;
  readonly raStarProperMotionArcsecPerYear: number;
  readonly decProperMotionArcsecPerYear: number;
  readonly radialKmPerSecond: number;
}>;
export type Output = Readonly<{
  readonly uKmPerSecond: number;
  readonly vKmPerSecond: number;
  readonly wKmPerSecond: number;
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
    factor = 4.74047 * input.distanceParsecs,
    velocity = line.map(
      (v, i) =>
        v * input.radialKmPerSecond +
        factor *
          (east[i] * input.raStarProperMotionArcsecPerYear +
            north[i] * input.decProperMotionArcsecPerYear),
    ),
    uvw = matrixVector(galacticRotation, velocity);
  return { uKmPerSecond: uvw[0], vKmPerSecond: uvw[1], wKmPerSecond: uvw[2] };
};
export const exampleInput = {
  raDegrees: 0,
  decDegrees: 0,
  distanceParsecs: 1,
  raStarProperMotionArcsecPerYear: 0,
  decProperMotionArcsecPerYear: 0,
  radialKmPerSecond: 1,
} satisfies Input;
export const exampleOutput = {
  uKmPerSecond: -0.0548755604162154,
  vKmPerSecond: 0.4941094278755837,
  wKmPerSecond: -0.8676661490190047,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/galactic-space-velocity-uvw",
  title: "Galactic Space Velocity Uvw",
  description:
    "Transform ICRS proper motion (RA*=RA·cos Dec), distance and radial velocity into heliocentric U toward Galactic center, V along rotation, W north; no solar-motion correction is applied.",
  inputs: [
    { id: "raDegrees", label: "Ra degrees", kind: "number" },
    { id: "decDegrees", label: "Dec degrees", kind: "number" },
    { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
    {
      id: "raStarProperMotionArcsecPerYear",
      label: "Ra star proper motion arcsec per year",
      kind: "number",
      description:
        "RA* = RA proper motion × cos(declination), in arcseconds per Julian year.",
    },
    {
      id: "decProperMotionArcsecPerYear",
      label: "Dec proper motion arcsec per year",
      kind: "number",
    },
    { id: "radialKmPerSecond", label: "Radial km per second", kind: "number" },
  ],
  outputs: [
    { id: "uKmPerSecond", label: "U km per second", kind: "number" },
    { id: "vKmPerSecond", label: "V km per second", kind: "number" },
    { id: "wKmPerSecond", label: "W km per second", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      raDegrees: value.raDegrees as number,
      decDegrees: value.decDegrees as number,
      distanceParsecs: value.distanceParsecs as number,
      raStarProperMotionArcsecPerYear:
        value.raStarProperMotionArcsecPerYear as number,
      decProperMotionArcsecPerYear:
        value.decProperMotionArcsecPerYear as number,
      radialKmPerSecond: value.radialKmPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
