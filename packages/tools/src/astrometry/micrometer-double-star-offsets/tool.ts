import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, rad, deg, wrap } from "../shared.js";

export type Input = Readonly<{
  readonly eastDivisions: number;
  readonly northDivisions: number;
  readonly arcsecondsPerDivision: number;
  readonly instrumentRotationDegrees: number;
}>;
export type Output = Readonly<{
  readonly eastOffsetArcseconds: number;
  readonly northOffsetArcseconds: number;
  readonly separationArcseconds: number;
  readonly positionAngleDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.arcsecondsPerDivision, "arcsecondsPerDivision");
  const angle = rad(input.instrumentRotationDegrees),
    x = input.eastDivisions * input.arcsecondsPerDivision,
    y = input.northDivisions * input.arcsecondsPerDivision,
    eastOffsetArcseconds = x * Math.cos(angle) - y * Math.sin(angle),
    northOffsetArcseconds = x * Math.sin(angle) + y * Math.cos(angle),
    separationArcseconds = positive(Math.hypot(x, y), "eastDivisions");
  return {
    eastOffsetArcseconds,
    northOffsetArcseconds,
    separationArcseconds,
    positionAngleDegrees: wrap(
      deg(Math.atan2(eastOffsetArcseconds, northOffsetArcseconds)),
    ),
  };
};
export const exampleInput = {
  eastDivisions: 3,
  northDivisions: 4,
  arcsecondsPerDivision: 0.1,
  instrumentRotationDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  eastOffsetArcseconds: 0.3,
  northOffsetArcseconds: 0.4,
  separationArcseconds: 0.5,
  positionAngleDegrees: 36.86989764584402,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/micrometer-double-star-offsets",
  title: "Micrometer Double Star Offsets",
  description:
    "Calibrate and rotate micrometer offsets, reporting double-star separation and position angle east of north.",
  inputs: [
    { id: "eastDivisions", label: "East divisions", kind: "number" },
    { id: "northDivisions", label: "North divisions", kind: "number" },
    {
      id: "arcsecondsPerDivision",
      label: "Arcseconds per division",
      kind: "number",
    },
    {
      id: "instrumentRotationDegrees",
      label: "Instrument rotation degrees",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "eastOffsetArcseconds",
      label: "East offset arcseconds",
      kind: "number",
    },
    {
      id: "northOffsetArcseconds",
      label: "North offset arcseconds",
      kind: "number",
    },
    {
      id: "separationArcseconds",
      label: "Separation arcseconds",
      kind: "number",
    },
    {
      id: "positionAngleDegrees",
      label: "Position angle degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eastDivisions: value.eastDivisions as number,
      northDivisions: value.northDivisions as number,
      arcsecondsPerDivision: value.arcsecondsPerDivision as number,
      instrumentRotationDegrees: value.instrumentRotationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
