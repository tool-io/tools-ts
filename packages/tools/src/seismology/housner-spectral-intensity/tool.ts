import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const housnerSpectralIntensityExample = {
  input: { pseudoVelocitiesCmS: [10, 20, 30], sampleStepS: 0.1 },
  output: { spectralIntensityCm: 4 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const housnerSpectralIntensityTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pseudoVelocitiesCmS, sampleStepS }) => {
      const xs = pseudoVelocitiesCmS as unknown[];
      if (!Array.isArray(xs) || xs.length < 2)
        simpleError("pseudoVelocitiesCmS", "Need at least two samples.");
      const vs = xs as number[];
      if (vs.some((value) => value < 0))
        simpleError(
          "pseudoVelocitiesCmS",
          "Spectral velocities cannot be negative.",
        );
      if (!(sampleStepS > 0))
        simpleError("sampleStepS", "Period spacing must be positive.");
      let area = 0;
      for (let i = 1; i < vs.length; i++)
        area += ((vs[i - 1] + vs[i]) / 2) * sampleStepS;
      return { spectralIntensityCm: area };
    })(input as never) as Record<string, unknown>,
  description:
    "SI(Housner) = integral of PSV over 0.1–2.5 s approximated by trapezoid over supplied spectral velocities.",
  id: "seismology/housner-spectral-intensity",
  inputs: [
    {
      description: "Pseudo-spectral velocity samples (cm/s).",
      id: "pseudoVelocitiesCmS",
      kind: "numberList",
      label: "PSV_i",
    },
    {
      minimum: 0,
      description: "Period spacing.",
      id: "sampleStepS",
      kind: "number",
      label: "ΔT",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Housner spectral intensity.",
      id: "spectralIntensityCm",
      kind: "number",
      label: "SI",
      unit: "cm",
    },
  ],
  title: "Housner Spectral Intensity Calculator",
});
export const runHousnerSpectralIntensity = housnerSpectralIntensityTool.execute;
export { housnerSpectralIntensityExample as example };
export default housnerSpectralIntensityTool;
