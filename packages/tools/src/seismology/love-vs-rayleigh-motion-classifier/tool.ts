import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const loveVsRayleighMotionClassifierExample = {
  input: {
    transverseComponent: 100,
    verticalComponent: 10,
    radialComponent: 15,
  },
  output: { classification: "Love-like (SH dominated)" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const loveVsRayleighMotionClassifierTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ transverseComponent, verticalComponent, radialComponent }) => {
      const shEnergy = Math.abs(transverseComponent);
      const pSvEnergy = Math.hypot(verticalComponent, radialComponent);
      if (shEnergy > pSvEnergy * 3)
        return { classification: "Love-like (SH dominated)" };
      if (pSvEnergy > shEnergy * 3)
        return { classification: "Rayleigh-like (P-SV dominated)" };
      return { classification: "mixed or indeterminate" };
    })(input as never) as Record<string, unknown>,
  description:
    "Screen surface-wave component amplitudes for Love-like SH dominance or Rayleigh-like P-SV dominance. Amplitudes alone cannot determine ellipticity or retrograde phase motion.",
  id: "seismology/love-vs-rayleigh-motion-classifier",
  inputs: [
    {
      description: "Transverse motion amplitude.",
      id: "transverseComponent",
      kind: "number",
      label: "SH",
      unit: "counts",
    },
    {
      description: "Vertical motion amplitude.",
      id: "verticalComponent",
      kind: "number",
      label: "Z",
      unit: "counts",
    },
    {
      description: "Radial motion amplitude.",
      id: "radialComponent",
      kind: "number",
      label: "R",
      unit: "counts",
    },
  ],
  outputs: [
    {
      description: "Love, Rayleigh, or mixed classification.",
      id: "classification",
      kind: "string",
      label: "Wave type",
    },
  ],
  title: "Love vs Rayleigh Motion Classifier",
});
export const runLoveVsRayleighMotionClassifier =
  loveVsRayleighMotionClassifierTool.execute;
export { loveVsRayleighMotionClassifierExample as example };
export default loveVsRayleighMotionClassifierTool;
