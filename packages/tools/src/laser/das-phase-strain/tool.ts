import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly phaseChangeRadians: number;
  readonly wavelengthMeters: number;
  readonly refractiveIndex: number;
  readonly gaugeLengthMeters: number;
  readonly strainOpticFactor: number;
}>;
export type Output = Readonly<{
  readonly strain: number;
  readonly microstrain: number;
}>;

export const calculate = (input: Input): Output => {
  const denominator =
    4 *
    Math.PI *
    input.refractiveIndex *
    input.gaugeLengthMeters *
    input.strainOpticFactor;
  if (denominator <= 0)
    simpleError(
      "gaugeLengthMeters",
      "Optical and gauge parameters must produce a positive denominator.",
      "invalid_gauge",
    );
  const strain =
    (input.phaseChangeRadians * input.wavelengthMeters) / denominator;
  return { strain, microstrain: strain * 1e6 };
};

export const exampleInput = {
  phaseChangeRadians: 12.566370614359172,
  wavelengthMeters: 1e-6,
  refractiveIndex: 1,
  gaugeLengthMeters: 1,
  strainOpticFactor: 1,
} satisfies Input;
export const exampleOutput = { strain: 1e-6, microstrain: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      phaseChangeRadians: input.phaseChangeRadians as number,
      wavelengthMeters: input.wavelengthMeters as number,
      refractiveIndex: input.refractiveIndex as number,
      gaugeLengthMeters: input.gaugeLengthMeters as number,
      strainOpticFactor: input.strainOpticFactor as number,
    }),
  description:
    "Convert DAS phase change into strain using supplied optical gauge parameters.",
  id: "laser/das-phase-strain",
  inputs: [
    {
      id: "phaseChangeRadians",
      label: "Optical phase change",
      kind: "number",
      unit: "rad",
    },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "refractiveIndex",
      label: "Fiber refractive index",
      kind: "number",
      minimum: 0,
    },
    {
      id: "gaugeLengthMeters",
      label: "Gauge length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "strainOpticFactor",
      label: "Effective strain-optic factor",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "strain", label: "Longitudinal strain", kind: "number" },
    {
      id: "microstrain",
      label: "Longitudinal strain",
      kind: "number",
      unit: "µε",
    },
  ],
  title: "DAS Phase Strain",
});

export const run = tool.execute;
export default tool;
