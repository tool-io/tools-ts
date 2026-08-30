import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fringeCount: number;
  readonly wavelengthMeters: number;
  readonly refractiveIndex: number;
  readonly incidenceAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly displacementMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0 || input.refractiveIndex <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength and refractive index must be positive.",
      "invalid_optics",
    );
  const cosine = Math.cos((input.incidenceAngleDegrees * Math.PI) / 180);
  if (Math.abs(cosine) < 1e-12)
    simpleError(
      "incidenceAngleDegrees",
      "Incidence angle makes displacement singular.",
      "singular_angle",
    );
  return {
    displacementMeters:
      (input.fringeCount * input.wavelengthMeters) /
      (2 * input.refractiveIndex * cosine),
  };
};

export const exampleInput = {
  fringeCount: 20,
  wavelengthMeters: 5e-7,
  refractiveIndex: 1,
  incidenceAngleDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  displacementMeters: 0.0000049999999999999996,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fringeCount: input.fringeCount as number,
      wavelengthMeters: input.wavelengthMeters as number,
      refractiveIndex: input.refractiveIndex as number,
      incidenceAngleDegrees: input.incidenceAngleDegrees as number,
    }),
  description:
    "Convert reflected-path fringe count to displacement with refractive-index and angle correction.",
  id: "laser/interferometer-displacement",
  inputs: [
    { id: "fringeCount", label: "Fringe count", kind: "number" },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "refractiveIndex",
      label: "Path refractive index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "incidenceAngleDegrees",
      label: "Incidence angle",
      kind: "number",
      unit: "°",
    },
  ],
  outputs: [
    {
      id: "displacementMeters",
      label: "Reflector displacement",
      kind: "number",
      unit: "m",
    },
  ],
  title: "Interferometer Displacement",
});

export const run = tool.execute;
export default tool;
