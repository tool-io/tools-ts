import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TotalHarmonicDistortionInput = {
  readonly fundamentalV: number;
  readonly harmonic2V: number;
  readonly harmonic3V: number;
};

export type TotalHarmonicDistortionOutput = {
  readonly thdPercent: number;
};

export const totalHarmonicDistortionExample = {
  input: { fundamentalV: 1, harmonic2V: 0.01, harmonic3V: 0.005 },
  output: { thdPercent: 1.118033988749895 },
} satisfies ToolExample<
  TotalHarmonicDistortionInput,
  TotalHarmonicDistortionOutput
>;

export const totalHarmonicDistortionTool = createSimpleTool({
  id: "electronics/total-harmonic-distortion",
  title: "THD Percent",
  description:
    "Compute total harmonic distortion in percent as 100 x sqrt(V2^2 + V3^2) / Vfundamental; harmonics must be non-negative and the fundamental positive.",
  inputs: [
    { id: "fundamentalV", label: "Fundamental", kind: "number", unit: "V" },
    { id: "harmonic2V", label: "2nd harmonic", kind: "number", unit: "V" },
    { id: "harmonic3V", label: "3rd harmonic", kind: "number", unit: "V" },
  ],
  outputs: [{ id: "thdPercent", label: "THD", kind: "number", unit: "%" }],
  calculate: (input) => {
    const fundamentalV = input.fundamentalV as number;
    const harmonic2V = input.harmonic2V as number;
    const harmonic3V = input.harmonic3V as number;
    if (!(fundamentalV > 0))
      simpleError(
        "fundamentalV",
        "Fundamental amplitude must be positive.",
        "invalid_fundamental",
      );
    if (!(harmonic2V >= 0))
      simpleError(
        "harmonic2V",
        "Second harmonic must not be negative.",
        "invalid_harmonic",
      );
    if (!(harmonic3V >= 0))
      simpleError(
        "harmonic3V",
        "Third harmonic must not be negative.",
        "invalid_harmonic",
      );
    return {
      thdPercent:
        (Math.sqrt(harmonic2V ** 2 + harmonic3V ** 2) / fundamentalV) * 100,
    };
  },
});
export const runTotalHarmonicDistortion = totalHarmonicDistortionTool.execute;
export default totalHarmonicDistortionTool;
