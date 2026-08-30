import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nonlinearIndexM2PerW: number;
  readonly copropagatingIntensityWPerM2: number;
  readonly interactionLengthMeters: number;
  readonly probeWavelengthMeters: number;
}>;
export type Output = Readonly<{
  readonly indexChange: number;
  readonly nonlinearPhaseRadians: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.probeWavelengthMeters <= 0)
    simpleError(
      "probeWavelengthMeters",
      "Probe wavelength must be positive.",
      "invalid_wavelength",
    );
  const indexChange =
    2 * input.nonlinearIndexM2PerW * input.copropagatingIntensityWPerM2;
  return {
    indexChange,
    nonlinearPhaseRadians:
      ((2 * Math.PI) / input.probeWavelengthMeters) *
      indexChange *
      input.interactionLengthMeters,
  };
};

export const exampleInput = {
  nonlinearIndexM2PerW: 0.5,
  copropagatingIntensityWPerM2: 1,
  interactionLengthMeters: 1,
  probeWavelengthMeters: 6.283185307179586,
} satisfies Input;
export const exampleOutput = {
  indexChange: 1,
  nonlinearPhaseRadians: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nonlinearIndexM2PerW: input.nonlinearIndexM2PerW as number,
      copropagatingIntensityWPerM2:
        input.copropagatingIntensityWPerM2 as number,
      interactionLengthMeters: input.interactionLengthMeters as number,
      probeWavelengthMeters: input.probeWavelengthMeters as number,
    }),
  description: "Calculate cross-phase index change and nonlinear phase shift.",
  id: "laser/xpm-phase-shift",
  inputs: [
    {
      id: "nonlinearIndexM2PerW",
      label: "Nonlinear refractive index",
      kind: "number",
      unit: "m²/W",
    },
    {
      id: "copropagatingIntensityWPerM2",
      label: "Copropagating intensity",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "interactionLengthMeters",
      label: "Interaction length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "probeWavelengthMeters",
      label: "Probe wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    { id: "indexChange", label: "Cross-phase index change", kind: "number" },
    {
      id: "nonlinearPhaseRadians",
      label: "Cross-phase shift",
      kind: "number",
      unit: "rad",
    },
  ],
  title: "XPM Phase Shift",
});

export const run = tool.execute;
export default tool;
