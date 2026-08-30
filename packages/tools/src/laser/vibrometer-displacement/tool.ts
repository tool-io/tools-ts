import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fringeCount: number;
  readonly wavelengthMeters: number;
  readonly incidenceAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly displacementMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
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
      (input.fringeCount * input.wavelengthMeters) / (2 * cosine),
  };
};

export const exampleInput = {
  fringeCount: 100,
  wavelengthMeters: 6.33e-7,
  incidenceAngleDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  displacementMeters: 0.000031650000000000004,
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
      incidenceAngleDegrees: input.incidenceAngleDegrees as number,
    }),
  description:
    "Convert interferometric fringe count to out-of-plane vibrometer displacement.",
  id: "laser/vibrometer-displacement",
  inputs: [
    {
      id: "fringeCount",
      label: "Interferometric fringe count",
      kind: "number",
    },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
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
      label: "Out-of-plane displacement",
      kind: "number",
      unit: "m",
    },
  ],
  title: "Vibrometer Displacement",
});

export const run = tool.execute;
export default tool;
