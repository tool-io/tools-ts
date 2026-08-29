import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antialiasFilterCornerNyquistCheckerExample = {
  input: { sampleRateHz: 100, filterCornerHz: 40 },
  output: { nyquistHz: 50, cornerFractionOfNyquist: 0.8, adequate: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const antialiasFilterCornerNyquistCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ sampleRateHz, filterCornerHz }) => {
      if (sampleRateHz <= 0)
        simpleError("sampleRateHz", "Sample rate must be positive.");
      const nyquistHz = sampleRateHz / 2;
      const frac = filterCornerHz / nyquistHz;
      return {
        nyquistHz,
        cornerFractionOfNyquist: frac,
        adequate: frac <= 0.8,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Check that a low-pass corner sits safely below the Nyquist frequency of the sample rate.",
  id: "seismology/antialias-filter-corner-nyquist-checker",
  inputs: [
    {
      minimum: 0,
      description: "Sampling rate.",
      id: "sampleRateHz",
      kind: "number",
      label: "fs",
      unit: "Hz",
    },
    {
      minimum: 0,
      description: "Low-pass corner.",
      id: "filterCornerHz",
      kind: "number",
      label: "f_c",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Nyquist frequency.",
      id: "nyquistHz",
      kind: "number",
      label: "f_N",
      unit: "Hz",
    },
    {
      description: "Corner as fraction of Nyquist.",
      id: "cornerFractionOfNyquist",
      kind: "number",
      label: "f_c/f_N",
    },
    {
      description: "Whether the corner is at or below 80 percent of Nyquist.",
      id: "adequate",
      kind: "boolean",
      label: "OK?",
    },
  ],
  title: "Antialias Filter Corner Nyquist Checker",
});
export const runAntialiasFilterCornerNyquistChecker =
  antialiasFilterCornerNyquistCheckerTool.execute;
export { antialiasFilterCornerNyquistCheckerExample as example };
export default antialiasFilterCornerNyquistCheckerTool;
