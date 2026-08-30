import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly incidentRefractiveIndex: number;
  readonly transmittedRefractiveIndex: number;
}>;
export type Output = Readonly<{
  readonly brewsterAngleDegrees: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.incidentRefractiveIndex <= 0 ||
    input.transmittedRefractiveIndex <= 0
  )
    simpleError(
      "incidentRefractiveIndex",
      "Refractive indices must be positive.",
      "invalid_index",
    );
  return {
    brewsterAngleDegrees:
      (Math.atan(
        input.transmittedRefractiveIndex / input.incidentRefractiveIndex,
      ) *
        180) /
      Math.PI,
  };
};

export const exampleInput = {
  incidentRefractiveIndex: 1,
  transmittedRefractiveIndex: 1.5,
} satisfies Input;
export const exampleOutput = {
  brewsterAngleDegrees: 56.309932474020215,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      incidentRefractiveIndex: input.incidentRefractiveIndex as number,
      transmittedRefractiveIndex: input.transmittedRefractiveIndex as number,
    }),
  description:
    "Calculate Brewster angle between two supplied refractive indices.",
  id: "laser/brewster-angle",
  inputs: [
    {
      id: "incidentRefractiveIndex",
      label: "Incident-medium refractive index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "transmittedRefractiveIndex",
      label: "Transmitted-medium refractive index",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "brewsterAngleDegrees",
      label: "Brewster angle",
      kind: "number",
      minimum: 0,
      maximum: 90,
      unit: "°",
    },
  ],
  title: "Brewster Angle",
});

export const run = tool.execute;
export default tool;
