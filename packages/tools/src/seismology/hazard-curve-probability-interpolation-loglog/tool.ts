import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hazardCurveProbabilityInterpolationLoglogExample = {
  input: {
    amplitudesG: [0.05, 0.2],
    annualProbabilities: [0.01, 0.001],
    targetAmplitudeG: 0.1,
  },
  output: {
    interpolatedProbability: 0.003162277660168379,
    segmentSlope: 0.5000000000000001,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const hazardCurveProbabilityInterpolationLoglogTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ amplitudesG, annualProbabilities, targetAmplitudeG }) => {
      const A = amplitudesG as unknown[];
      const P = annualProbabilities as unknown[];
      if (
        !Array.isArray(A) ||
        !Array.isArray(P) ||
        A.length !== P.length ||
        A.length < 2
      )
        simpleError("amplitudesG", "Provide matching ascending anchors.");
      const amps = A as number[];
      const probs = P as number[];
      if (
        amps.some((value) => value <= 0) ||
        probs.some((value) => value <= 0) ||
        amps.some((value, index) => index > 0 && value <= amps[index - 1])
      )
        simpleError(
          "amplitudesG",
          "Amplitudes must be positive and strictly ascending, and probabilities must be positive.",
        );
      const x = targetAmplitudeG;
      if (x <= 0 || x < amps[0] || x > amps[amps.length - 1])
        simpleError(
          "targetAmplitudeG",
          "Target outside the anchored amplitude range.",
        );
      let i = 1;
      while (i < amps.length && amps[i] < x) i++;
      const lx = Math.log(x);
      const w =
        (lx - Math.log(amps[i - 1])) /
        (Math.log(amps[i]) - Math.log(amps[i - 1]));
      const lp =
        Math.log(probs[i - 1]) +
        w * (Math.log(probs[i]) - Math.log(probs[i - 1]));
      return { interpolatedProbability: Math.exp(lp), segmentSlope: w };
    })(input as never) as Record<string, unknown>,
  description:
    "Log-log interpolation of annual exceedance probability between hazard-curve anchors.",
  id: "seismology/hazard-curve-probability-interpolation-loglog",
  inputs: [
    {
      description: "Anchor amplitudes in g (ascending).",
      id: "amplitudesG",
      kind: "numberList",
      label: "PGA_i",
      unit: "g",
    },
    {
      description: "Annual exceedance probabilities at anchors.",
      id: "annualProbabilities",
      kind: "numberList",
      label: "λ_i",
      unit: "1/yr",
    },
    {
      description: "Target amplitude.",
      id: "targetAmplitudeG",
      kind: "number",
      label: "a*",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Interpolated annual probability.",
      id: "interpolatedProbability",
      kind: "number",
      label: "λ(a*)",
      unit: "1/yr",
    },
    {
      description: "Normalized position within the anchor segment.",
      id: "segmentSlope",
      kind: "number",
      label: "w",
    },
  ],
  title: "Hazard Curve Probability Interpolation Log-Log",
});
export const runHazardCurveProbabilityInterpolationLoglog =
  hazardCurveProbabilityInterpolationLoglogTool.execute;
export { hazardCurveProbabilityInterpolationLoglogExample as example };
export default hazardCurveProbabilityInterpolationLoglogTool;
