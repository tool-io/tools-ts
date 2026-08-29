import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    steinmetzK: 0.01,
    frequencyHz: 1000,
    peakFluxDensityT: 0.1,
    frequencyExponent: 1.5,
    fluxExponent: 2,
  },
  output: { lossDensity: 3.1622776601683795 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/inductor-core-loss-density",
  title: "Inductor Steinmetz Core Loss Density",
  description:
    "Estimate magnetic-core loss density with a fitted Steinmetz power law p=k f^α B^β. Units of k must match the selected frequency, peak flux-density, and desired output units; the model applies only over its fitted waveform/range.",
  inputs: [
    {
      id: "steinmetzK",
      kind: "number",
      label: "Steinmetz coefficient",
      minimum: 0,
    },
    { id: "frequencyHz", kind: "number", label: "Frequency (Hz)", minimum: 0 },
    {
      id: "peakFluxDensityT",
      kind: "number",
      label: "Peak flux density (T)",
      minimum: 0,
    },
    {
      id: "frequencyExponent",
      kind: "number",
      label: "Frequency exponent α",
      minimum: 0,
    },
    {
      id: "fluxExponent",
      kind: "number",
      label: "Flux exponent β",
      minimum: 0,
    },
  ],
  outputs: [{ id: "lossDensity", kind: "number", label: "Loss Density" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      lossDensity:
        i.steinmetzK *
        Math.pow(i.frequencyHz, i.frequencyExponent) *
        Math.pow(i.peakFluxDensityT, i.fluxExponent),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type InductorCoreLossDensityInput = Readonly<typeof example.input>;
export type InductorCoreLossDensityOutput = Readonly<typeof example.output>;
export const inductorCoreLossDensityTool = tool;
export const runInductorCoreLossDensity = tool.execute;
export default tool;
