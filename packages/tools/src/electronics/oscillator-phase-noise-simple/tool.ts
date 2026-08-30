import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OscillatorPhaseNoiseSimpleInput = Readonly<{
  readonly noisePowerDensityWPerHz: number;
  readonly carrierPowerW: number;
}>;
export type OscillatorPhaseNoiseSimpleOutput = Readonly<{
  readonly phaseNoiseDbcPerHz: number;
}>;

export const calculateOscillatorPhaseNoiseSimple = (
  x: OscillatorPhaseNoiseSimpleInput,
): OscillatorPhaseNoiseSimpleOutput => {
  if (
    !Number.isFinite(x.noisePowerDensityWPerHz) ||
    x.noisePowerDensityWPerHz < 0
  )
    simpleError(
      "noisePowerDensityWPerHz",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.carrierPowerW) || x.carrierPowerW < 0)
    simpleError("carrierPowerW", "Provide a finite number at least 0.");
  if (!(x.noisePowerDensityWPerHz > 0 && x.carrierPowerW > 0))
    simpleError("input", "Noise density and carrier power must be positive.");
  const phaseNoiseDbcPerHz =
    10 * Math.log10(x.noisePowerDensityWPerHz / x.carrierPowerW);
  if (!Number.isFinite(phaseNoiseDbcPerHz))
    simpleError("phaseNoiseDbcPerHz", "The inputs produce an invalid result.");
  return {
    phaseNoiseDbcPerHz: Object.is(phaseNoiseDbcPerHz, -0)
      ? 0
      : phaseNoiseDbcPerHz,
  };
};

export const example = {
  input: { noisePowerDensityWPerHz: 1e-12, carrierPowerW: 0.001 },
  output: { phaseNoiseDbcPerHz: -90 },
} satisfies ToolExample<
  OscillatorPhaseNoiseSimpleInput,
  OscillatorPhaseNoiseSimpleOutput
>;

export const tool = createSimpleTool({
  id: "electronics/oscillator-phase-noise-simple",
  title: "Oscillator Phase Noise Simple",
  description:
    "Express single-sideband noise power spectral density relative to carrier power at a specified offset, in dBc/Hz.",
  inputs: [
    {
      id: "noisePowerDensityWPerHz",
      kind: "number",
      label: "Single-sideband noise density",
      unit: "W/Hz",
      minimum: 0,
    },
    {
      id: "carrierPowerW",
      kind: "number",
      label: "Carrier power",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "phaseNoiseDbcPerHz",
      kind: "number",
      label: "Phase noise at offset",
      unit: "dBc/Hz",
    },
  ],
  calculate: (input) =>
    calculateOscillatorPhaseNoiseSimple({
      noisePowerDensityWPerHz: input.noisePowerDensityWPerHz as number,
      carrierPowerW: input.carrierPowerW as number,
    }),
});
export const oscillatorPhaseNoiseSimpleTool = tool;
export const runOscillatorPhaseNoiseSimple = tool.execute;
export default tool;
