import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cavityLengthMeters: number;
  readonly refractiveIndex: number;
  readonly gainBandwidthHertz: number;
}>;
export type Output = Readonly<{
  readonly freeSpectralRangeHertz: number;
  readonly longitudinalModeCount: number;
  readonly roundTripTimeSeconds: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.cavityLengthMeters <= 0 || input.refractiveIndex <= 0)
    simpleError(
      "cavityLengthMeters",
      "Cavity length and refractive index must be positive.",
      "invalid_cavity",
    );
  const roundTripTimeSeconds =
    (2 * input.refractiveIndex * input.cavityLengthMeters) / 299792458;
  const freeSpectralRangeHertz = 1 / roundTripTimeSeconds;
  return {
    freeSpectralRangeHertz,
    longitudinalModeCount: Math.max(
      1,
      Math.floor(input.gainBandwidthHertz / freeSpectralRangeHertz) + 1,
    ),
    roundTripTimeSeconds,
  };
};

export const exampleInput = {
  cavityLengthMeters: 1,
  refractiveIndex: 1,
  gainBandwidthHertz: 299792458,
} satisfies Input;
export const exampleOutput = {
  freeSpectralRangeHertz: 149896229,
  longitudinalModeCount: 3,
  roundTripTimeSeconds: 6.671281903963041e-9,
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
      gainBandwidthHertz: input.gainBandwidthHertz as number,
    }),
  description:
    "Calculate cavity free spectral range and longitudinal modes within a gain bandwidth.",
  id: "laser/longitudinal-mode-count",
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
    {
      id: "gainBandwidthHertz",
      label: "Gain bandwidth",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
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
      id: "longitudinalModeCount",
      label: "Longitudinal mode count",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "roundTripTimeSeconds",
      label: "Cavity round-trip time",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  title: "Longitudinal Mode Count",
});

export const run = tool.execute;
export default tool;
