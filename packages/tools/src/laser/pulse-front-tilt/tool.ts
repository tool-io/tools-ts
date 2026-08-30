import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly centerWavelengthMeters: number;
  readonly angularDispersionRadPerMeter: number;
}>;
export type Output = Readonly<{
  readonly tiltTangent: number;
  readonly pulseFrontTiltDegrees: number;
}>;

export const calculate = (input: Input): Output => {
  const tiltTangent =
    input.centerWavelengthMeters * input.angularDispersionRadPerMeter;
  return {
    tiltTangent,
    pulseFrontTiltDegrees: (Math.atan(tiltTangent) * 180) / Math.PI,
  };
};

export const exampleInput = {
  centerWavelengthMeters: 1,
  angularDispersionRadPerMeter: 1,
} satisfies Input;
export const exampleOutput = {
  tiltTangent: 1,
  pulseFrontTiltDegrees: 45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      centerWavelengthMeters: input.centerWavelengthMeters as number,
      angularDispersionRadPerMeter:
        input.angularDispersionRadPerMeter as number,
    }),
  description:
    "Calculate pulse-front tilt from center wavelength and angular dispersion.",
  id: "laser/pulse-front-tilt",
  inputs: [
    {
      id: "centerWavelengthMeters",
      label: "Center wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "angularDispersionRadPerMeter",
      label: "Angular dispersion",
      kind: "number",
      unit: "rad/m",
    },
  ],
  outputs: [
    { id: "tiltTangent", label: "Pulse-front tilt tangent", kind: "number" },
    {
      id: "pulseFrontTiltDegrees",
      label: "Pulse-front tilt",
      kind: "number",
      unit: "°",
    },
  ],
  title: "Pulse-Front Tilt",
});

export const run = tool.execute;
export default tool;
