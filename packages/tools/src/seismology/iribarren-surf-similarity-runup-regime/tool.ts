import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const iribarrenSurfSimilarityRunupRegimeExample = {
  input: { beachSlopeTan: 0.05, waveHeightM: 3, periodSeconds: 12 },
  output: { iribarrenNumber: 0.4328477781019318, breakingRegime: "spilling" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const iribarrenSurfSimilarityRunupRegimeTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ beachSlopeTan, waveHeightM, periodSeconds }) => {
      if (!(waveHeightM > 0))
        simpleError("waveHeightM", "Wave height must be positive.");
      if (!(periodSeconds > 0))
        simpleError("periodSeconds", "Wave period must be positive.");
      const deepLengthM = (9.81 * periodSeconds ** 2) / (2 * Math.PI);
      const xi = beachSlopeTan / Math.sqrt(waveHeightM / deepLengthM);
      return {
        iribarrenNumber: xi,
        breakingRegime:
          xi < 0.5 ? "spilling" : xi <= 3.3 ? "plunging" : "surging",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Deep-water Iribarren number ξ = tanβ/√(H/L₀) and the conventional spilling, plunging, or surging breaker classification.",
  id: "seismology/iribarren-surf-similarity-runup-regime",
  inputs: [
    {
      minimum: 0,
      description: "Beach slope.",
      id: "beachSlopeTan",
      kind: "number",
      label: "tanβ",
    },
    {
      minimum: 0,
      description: "Offshore wave height.",
      id: "waveHeightM",
      kind: "number",
      label: "H",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Wave period.",
      id: "periodSeconds",
      kind: "number",
      label: "T",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Surf similarity parameter.",
      id: "iribarrenNumber",
      kind: "number",
      label: "ξ",
    },
    {
      description: "Spilling, plunging, or surging.",
      id: "breakingRegime",
      kind: "string",
      label: "Regime",
    },
  ],
  title: "Iribarren Surf Similarity Runup Regime Classifier",
});
export const runIribarrenSurfSimilarityRunupRegime =
  iribarrenSurfSimilarityRunupRegimeTool.execute;
export { iribarrenSurfSimilarityRunupRegimeExample as example };
export default iribarrenSurfSimilarityRunupRegimeTool;
