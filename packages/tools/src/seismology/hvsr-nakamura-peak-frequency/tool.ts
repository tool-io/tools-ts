import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hvsrNakamuraPeakFrequencyExample = {
  input: {
    frequenciesHz: [0.2, 0.5, 1.2, 2.5, 6],
    hvRatios: [1.1, 1.6, 4.2, 1.8, 1.2],
  },
  output: { peakFrequencyHz: 1.2, peakAmplitude: 4.2 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const hvsrNakamuraPeakFrequencyTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ frequenciesHz, hvRatios }) => {
      const fs = frequenciesHz as unknown[];
      const hs = hvRatios as unknown[];
      if (
        !Array.isArray(fs) ||
        !Array.isArray(hs) ||
        fs.length !== hs.length ||
        fs.length === 0
      )
        simpleError("frequenciesHz", "Provide equal-length non-empty axes.");
      let best = 0;
      for (let i = 1; i < (hs as number[]).length; i++)
        if ((hs as number[])[i] > (hs as number[])[best]) best = i;
      return {
        peakFrequencyHz: (fs as number[])[best],
        peakAmplitude: (hs as number[])[best],
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Fundamental site frequency from the peak of an H/V spectral-ratio curve.",
  id: "seismology/hvsr-nakamura-peak-frequency",
  inputs: [
    {
      description: "Frequency axis samples (ascending).",
      id: "frequenciesHz",
      kind: "numberList",
      label: "f_i",
    },
    {
      description: "Spectral-ratio amplitudes.",
      id: "hvRatios",
      kind: "numberList",
      label: "H/V",
    },
  ],
  outputs: [
    {
      description: "Peak frequency.",
      id: "peakFrequencyHz",
      kind: "number",
      label: "f₀",
      unit: "Hz",
    },
    {
      description: "Peak H/V amplitude.",
      id: "peakAmplitude",
      kind: "number",
      label: "A₀",
    },
  ],
  title: "HVSR Nakamura Peak Frequency Calculator",
});
export const runHvsrNakamuraPeakFrequency =
  hvsrNakamuraPeakFrequencyTool.execute;
export { hvsrNakamuraPeakFrequencyExample as example };
export default hvsrNakamuraPeakFrequencyTool;
