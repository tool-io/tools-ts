import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cavityLengthMeters: number;
  readonly refractiveIndex: number;
  readonly finesse: number;
}>;
export type Output = Readonly<{
  readonly freeSpectralRangeHertz: number;
  readonly linewidthHertz: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cavityLengthMeters <= 0 ||
    input.refractiveIndex <= 0 ||
    input.finesse <= 0
  )
    simpleError(
      "cavityLengthMeters",
      "Length, refractive index, and finesse must be positive.",
      "invalid_cavity",
    );
  const freeSpectralRangeHertz =
    299792458 / (2 * input.refractiveIndex * input.cavityLengthMeters);
  return {
    freeSpectralRangeHertz,
    linewidthHertz: freeSpectralRangeHertz / input.finesse,
  };
};

export const exampleInput = {
  cavityLengthMeters: 0.1,
  refractiveIndex: 1,
  finesse: 100,
} satisfies Input;
export const exampleOutput = {
  freeSpectralRangeHertz: 1498962290,
  linewidthHertz: 14989622.9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cavityLengthMeters: input.cavityLengthMeters as number,
      refractiveIndex: input.refractiveIndex as number,
      finesse: input.finesse as number,
    }),
  description:
    "Calculate Fabry–Pérot free spectral range and linewidth from cavity length, index, and finesse.",
  id: "laser/fabry-perot-linewidth",
  inputs: [
    {
      id: "cavityLengthMeters",
      label: "Cavity length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "refractiveIndex",
      label: "Cavity refractive index",
      kind: "number",
      minimum: 0,
    },
    { id: "finesse", label: "Finesse", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "freeSpectralRangeHertz",
      label: "Free spectral range",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "linewidthHertz",
      label: "Resonance linewidth",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  title: "Fabry-P\u00e9rot Linewidth",
});

export const run = tool.execute;
export default tool;
