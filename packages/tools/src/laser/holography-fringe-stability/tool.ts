import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly wavelengthMeters: number;
  readonly measuredPathDriftMeters: number;
  readonly allowedWavelengthFraction: number;
}>;
export type Output = Readonly<{
  readonly allowedPathDriftMeters: number;
  readonly stabilityMarginMeters: number;
  readonly withinRequirement: boolean;
}>;

export const calculate = (input: Input): Output => {
  const allowedPathDriftMeters =
    input.wavelengthMeters * input.allowedWavelengthFraction;
  return {
    allowedPathDriftMeters,
    stabilityMarginMeters:
      allowedPathDriftMeters - input.measuredPathDriftMeters,
    withinRequirement: input.measuredPathDriftMeters <= allowedPathDriftMeters,
  };
};

export const exampleInput = {
  wavelengthMeters: 5e-7,
  measuredPathDriftMeters: 1e-7,
  allowedWavelengthFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  allowedPathDriftMeters: 1.25e-7,
  stabilityMarginMeters: 2.5e-8,
  withinRequirement: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      wavelengthMeters: input.wavelengthMeters as number,
      measuredPathDriftMeters: input.measuredPathDriftMeters as number,
      allowedWavelengthFraction: input.allowedWavelengthFraction as number,
    }),
  description:
    "Compare measured holography path drift with a caller-supplied wavelength-fraction requirement.",
  id: "laser/holography-fringe-stability",
  inputs: [
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "measuredPathDriftMeters",
      label: "Measured path drift",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "allowedWavelengthFraction",
      label: "Allowed wavelength fraction",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "allowedPathDriftMeters",
      label: "Allowed path drift",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "stabilityMarginMeters",
      label: "Path-stability margin",
      kind: "number",
      unit: "m",
    },
    { id: "withinRequirement", label: "Within requirement", kind: "boolean" },
  ],
  title: "Holography Fringe Stability",
});

export const run = tool.execute;
export default tool;
