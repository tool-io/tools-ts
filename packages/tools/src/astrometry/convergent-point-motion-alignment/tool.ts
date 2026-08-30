import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  positive,
  nonnegative,
  rad,
  deg,
  wrap,
  signedAngle,
  skyVector,
} from "../shared.js";

export type Input = Readonly<{
  readonly starRaDegrees: number;
  readonly starDecDegrees: number;
  readonly apexRaDegrees: number;
  readonly apexDecDegrees: number;
  readonly eastProperMotion: number;
  readonly northProperMotion: number;
  readonly maximumMisalignmentDegrees: number;
}>;
export type Output = Readonly<{
  readonly apexPositionAngleDegrees: number;
  readonly motionMisalignmentDegrees: number;
  readonly alignedWithApex: boolean;
}>;
export const calculate = (input: Input): Output => {
  skyVector(input.starRaDegrees, input.starDecDegrees);
  skyVector(input.apexRaDegrees, input.apexDecDegrees);
  nonnegative(input.maximumMisalignmentDegrees, "maximumMisalignmentDegrees");
  if (input.maximumMisalignmentDegrees > 180)
    simpleError(
      "maximumMisalignmentDegrees",
      "Tolerance must not exceed 180 degrees.",
    );
  const a = rad(input.apexRaDegrees - input.starRaDegrees),
    d = rad(input.starDecDegrees),
    D = rad(input.apexDecDegrees),
    east = Math.cos(D) * Math.sin(a),
    north = Math.cos(d) * Math.sin(D) - Math.sin(d) * Math.cos(D) * Math.cos(a);
  positive(Math.hypot(east, north), "apexRaDegrees");
  positive(
    Math.hypot(input.eastProperMotion, input.northProperMotion),
    "eastProperMotion",
  );
  const apexPositionAngleDegrees = wrap(deg(Math.atan2(east, north))),
    motion = wrap(
      deg(Math.atan2(input.eastProperMotion, input.northProperMotion)),
    ),
    motionMisalignmentDegrees = Math.abs(
      signedAngle(motion - apexPositionAngleDegrees),
    );
  return {
    apexPositionAngleDegrees,
    motionMisalignmentDegrees,
    alignedWithApex:
      motionMisalignmentDegrees <= input.maximumMisalignmentDegrees,
  };
};
export const exampleInput = {
  starRaDegrees: 0,
  starDecDegrees: 0,
  apexRaDegrees: 90,
  apexDecDegrees: 0,
  eastProperMotion: 1,
  northProperMotion: 0,
  maximumMisalignmentDegrees: 5,
} satisfies Input;
export const exampleOutput = {
  apexPositionAngleDegrees: 90,
  motionMisalignmentDegrees: 0,
  alignedWithApex: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/convergent-point-motion-alignment",
  title: "Convergent Point Motion Alignment",
  description:
    "Compare a measured tangent-plane proper-motion direction with the great-circle direction to a supplied cluster apex; alignment does not establish membership.",
  inputs: [
    { id: "starRaDegrees", label: "Star ra degrees", kind: "number" },
    { id: "starDecDegrees", label: "Star dec degrees", kind: "number" },
    { id: "apexRaDegrees", label: "Apex ra degrees", kind: "number" },
    { id: "apexDecDegrees", label: "Apex dec degrees", kind: "number" },
    { id: "eastProperMotion", label: "East proper motion", kind: "number" },
    { id: "northProperMotion", label: "North proper motion", kind: "number" },
    {
      id: "maximumMisalignmentDegrees",
      label: "Maximum misalignment degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "apexPositionAngleDegrees",
      label: "Apex position angle degrees",
      kind: "number",
    },
    {
      id: "motionMisalignmentDegrees",
      label: "Motion misalignment degrees",
      kind: "number",
    },
    { id: "alignedWithApex", label: "Aligned with apex", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      starRaDegrees: value.starRaDegrees as number,
      starDecDegrees: value.starDecDegrees as number,
      apexRaDegrees: value.apexRaDegrees as number,
      apexDecDegrees: value.apexDecDegrees as number,
      eastProperMotion: value.eastProperMotion as number,
      northProperMotion: value.northProperMotion as number,
      maximumMisalignmentDegrees: value.maximumMisalignmentDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
