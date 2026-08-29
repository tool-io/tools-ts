import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tidalHarmonicResidualRmsCalculatorExample = {
  input: { observedMeters: [1.1, 2, 0.9], predictedMeters: [1, 2.1, 1] },
  output: (() => {
    const es = [1.1 - 1.0, 2.0 - 2.1, 0.9 - 1.0];
    return {
      rmsResidualM: Math.sqrt(es.reduce((a, e) => a + e * e, 0) / 3),
      maxAbsResidualM: Math.max(...es.map((e) => Math.abs(e))),
      meanResidualM: es.reduce((a, b) => a + b, 0) / 3,
    };
  })(),
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tidalHarmonicResidualRmsCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ observedMeters, predictedMeters }) => {
      const o = observedMeters as unknown[];
      const p = predictedMeters as unknown[];
      if (
        !Array.isArray(o) ||
        !Array.isArray(p) ||
        o.length !== p.length ||
        o.length === 0
      )
        simpleError("observedMeters", "Provide equal-length non-empty series.");
      const n = o.length;
      let sse = 0;
      let sum = 0;
      let maxAbs = 0;
      for (let i = 0; i < n; i++) {
        const e = (o as number[])[i] - (p as number[])[i];
        sse += e * e;
        sum += e;
        maxAbs = Math.max(maxAbs, Math.abs(e));
      }
      return {
        rmsResidualM: Math.sqrt(sse / n),
        maxAbsResidualM: maxAbs,
        meanResidualM: sum / n,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "RMS and peak residual between observed tide-gauge series and a harmonic prediction.",
  id: "seismology/tidal-harmonic-residual-rms-calculator",
  inputs: [
    {
      description: "Observed water levels.",
      id: "observedMeters",
      kind: "numberList",
      label: "obs",
    },
    {
      description: "Harmonic prediction.",
      id: "predictedMeters",
      kind: "numberList",
      label: "pred",
    },
  ],
  outputs: [
    {
      description: "Root-mean-square residual.",
      id: "rmsResidualM",
      kind: "number",
      label: "RMS",
      unit: "m",
    },
    {
      description: "Largest absolute residual.",
      id: "maxAbsResidualM",
      kind: "number",
      label: "max|ε|",
      unit: "m",
    },
    {
      description: "Mean residual (datum bias).",
      id: "meanResidualM",
      kind: "number",
      label: "ε̄",
      unit: "m",
    },
  ],
  title: "Tidal Harmonic Residual RMS Calculator",
});
export const runTidalHarmonicResidualRmsCalculator =
  tidalHarmonicResidualRmsCalculatorTool.execute;
export { tidalHarmonicResidualRmsCalculatorExample as example };
export default tidalHarmonicResidualRmsCalculatorTool;
