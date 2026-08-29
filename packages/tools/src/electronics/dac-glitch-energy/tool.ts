import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DacGlitchEnergyInput = Readonly<{
  readonly glitchAmplitudeV: number;
  readonly glitchDurationSeconds: number;
  readonly loadResistanceOhms: number;
}>;
export type DacGlitchEnergyOutput = Readonly<{ glitchEnergyJ: number }>;

export const calculateDacGlitchEnergy = (
  i: DacGlitchEnergyInput,
): DacGlitchEnergyOutput => {
  const value =
    (i.glitchAmplitudeV ** 2 * i.glitchDurationSeconds) / i.loadResistanceOhms;
  if (!Number.isFinite(value))
    simpleError("glitchEnergyJ", "The inputs produce a non-finite result.");
  return { glitchEnergyJ: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    glitchAmplitudeV: 0.2,
    glitchDurationSeconds: 2e-8,
    loadResistanceOhms: 50,
  },
  output: { glitchEnergyJ: 1.6000000000000003e-11 },
} satisfies ToolExample<DacGlitchEnergyInput, DacGlitchEnergyOutput>;

export const tool = createSimpleTool({
  id: "electronics/dac-glitch-energy",
  title: "DAC Glitch Energy",
  description:
    "Estimate actual energy dissipated in a resistive load by a rectangular DAC glitch pulse as V²t/R; datasheet glitch impulse in volt-seconds is a different quantity.",
  inputs: [
    {
      id: "glitchAmplitudeV",
      kind: "number",
      label: "Glitch Amplitude (V)",
      unit: "V",
    },
    {
      id: "glitchDurationSeconds",
      kind: "number",
      label: "Glitch Duration (s)",
      unit: "s",
      minimum: 0,
    },
    {
      id: "loadResistanceOhms",
      kind: "number",
      label: "Load Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "glitchEnergyJ",
      kind: "number",
      label: "Glitch Energy (J)",
      unit: "J",
    },
  ],
  calculate: (input) =>
    calculateDacGlitchEnergy({
      glitchAmplitudeV: input.glitchAmplitudeV as number,
      glitchDurationSeconds: input.glitchDurationSeconds as number,
      loadResistanceOhms: input.loadResistanceOhms as number,
    }),
});
export const dacGlitchEnergyTool = tool;
export const runDacGlitchEnergy = tool.execute;
export default tool;
