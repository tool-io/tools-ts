import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly periapsisRadius: number;
  readonly apoapsisRadius: number;
}>;
export type Output = Readonly<{
  readonly semimajorAxis: number;
  readonly orbitalEccentricity: number;
  readonly semilatusRectum: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.periapsisRadius, "periapsisRadius");
  positive(input.apoapsisRadius, "apoapsisRadius");
  if (input.apoapsisRadius < input.periapsisRadius)
    simpleError(
      "apoapsisRadius",
      "Apoapsis must not be smaller than periapsis.",
    );
  const semimajorAxis = (input.periapsisRadius + input.apoapsisRadius) / 2,
    orbitalEccentricity =
      (input.apoapsisRadius - input.periapsisRadius) /
      (input.apoapsisRadius + input.periapsisRadius);
  return {
    semimajorAxis,
    orbitalEccentricity,
    semilatusRectum:
      (2 * input.periapsisRadius * input.apoapsisRadius) /
      (input.periapsisRadius + input.apoapsisRadius),
  };
};
export const exampleInput = {
  periapsisRadius: 1,
  apoapsisRadius: 3,
} satisfies Input;
export const exampleOutput = {
  semimajorAxis: 2,
  orbitalEccentricity: 0.5,
  semilatusRectum: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/ellipse-from-apsis-radii",
  title: "Ellipse From Apsis Radii",
  description:
    "Recover ellipse shape parameters from ordered center-referenced periapsis and apoapsis radii, not surface altitudes.",
  inputs: [
    { id: "periapsisRadius", label: "Periapsis radius", kind: "number" },
    { id: "apoapsisRadius", label: "Apoapsis radius", kind: "number" },
  ],
  outputs: [
    { id: "semimajorAxis", label: "Semimajor axis", kind: "number" },
    {
      id: "orbitalEccentricity",
      label: "Orbital eccentricity",
      kind: "number",
    },
    { id: "semilatusRectum", label: "Semilatus rectum", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      periapsisRadius: value.periapsisRadius as number,
      apoapsisRadius: value.apoapsisRadius as number,
    }),
});
export const run = tool.execute;
export default tool;
