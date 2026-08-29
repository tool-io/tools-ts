import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const bruneDisplacementSpectrumPeakFrequencyNoteExample = {
  input: { cornerFrequencyHz: 3.5 },
  output: {
    displacementPeakHz: 3.5,
    note: "d(f) ∝ f/(1+(f/fc)²) peaks where (f/fc)=1; acceleration plateau starts at fc·√3.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const bruneDisplacementSpectrumPeakFrequencyNoteTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ cornerFrequencyHz }) => ({
      displacementPeakHz: cornerFrequencyHz,
      note: "d(f) ∝ f/(1+(f/fc)²) peaks where (f/fc)=1; acceleration plateau starts at fc·√3.",
    }))(input as never) as Record<string, unknown>,
  description:
    "For the Brune model, displacement amplitude peaks exactly at the corner frequency.",
  id: "seismology/brune-displacement-spectrum-peak-frequency-note",
  inputs: [
    {
      minimum: 0,
      description: "Corner frequency.",
      id: "cornerFrequencyHz",
      kind: "number",
      label: "f_c",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Peak of the displacement spectrum.",
      id: "displacementPeakHz",
      kind: "number",
      label: "f_peak",
      unit: "Hz",
    },
    {
      description: "Model note.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Brune Displacement Spectrum Peak Frequency Note",
});
export const runBruneDisplacementSpectrumPeakFrequencyNote =
  bruneDisplacementSpectrumPeakFrequencyNoteTool.execute;
export { bruneDisplacementSpectrumPeakFrequencyNoteExample as example };
export default bruneDisplacementSpectrumPeakFrequencyNoteTool;
