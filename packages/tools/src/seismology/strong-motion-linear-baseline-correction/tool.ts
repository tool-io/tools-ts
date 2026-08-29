import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const strongMotionLinearBaselineCorrectionExample = {
  input: {
    accelerationMS2: [0.1, 0.2, 0.15, -0.1, 0.05, 0.12, 0.14, 0.13],
    tailFraction: 0.25,
  },
  output: {
    correctedPeakMS2: 0.2700000000000008,
    removedOffsetMS2: 0.2000000000000015,
    driftRatePerSampleMS2: -0.010000000000000231,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const strongMotionLinearBaselineCorrectionTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ accelerationMS2, tailFraction }) => {
      const a = accelerationMS2 as unknown[];
      if (!Array.isArray(a) || a.length < 8)
        simpleError("accelerationMS2", "Provide at least eight samples.");
      const arr = a as number[];
      const n = arr.length;
      const frac = tailFraction;
      const startIdx = Math.min(Math.floor(n * (1 - frac)), n - 2);
      let sx = 0,
        sy = 0,
        sxx = 0,
        sxy = 0;
      const m = n - startIdx;
      for (let i = startIdx; i < n; i++) {
        sx += i;
        sy += arr[i];
        sxx += i * i;
        sxy += i * arr[i];
      }
      const slope = (m * sxy - sx * sy) / (m * sxx - sx * sx);
      const intercept = (sy - slope * sx) / m;
      let maxAbsCorrected = 0;
      for (let i = 0; i < n; i++) {
        const c = arr[i] - (intercept + slope * i);
        maxAbsCorrected = Math.max(maxAbsCorrected, Math.abs(c));
      }
      return {
        correctedPeakMS2: maxAbsCorrected,
        removedOffsetMS2: intercept,
        driftRatePerSampleMS2: slope,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Remove linear baseline drift fitted on the record tail and report the corrected peak.",
  id: "seismology/strong-motion-linear-baseline-correction",
  inputs: [
    {
      description: "Raw acceleration samples.",
      id: "accelerationMS2",
      kind: "numberList",
      label: "a_i",
      unit: "m/s²",
    },
    {
      default: 0.25,
      minimum: 0.1,
      maximum: 0.5,
      description: "Tail fraction used to fit the baseline line.",
      id: "tailFraction",
      kind: "number",
      label: "f_tail",
    },
  ],
  outputs: [
    {
      description: "Peak absolute acceleration after detrending.",
      id: "correctedPeakMS2",
      kind: "number",
      label: "PGA_corr",
      unit: "m/s²",
    },
    {
      description: "Baseline offset removed at sample zero.",
      id: "removedOffsetMS2",
      kind: "number",
      label: "b₀",
      unit: "m/s²",
    },
    {
      description: "Linear drift removed per sample.",
      id: "driftRatePerSampleMS2",
      kind: "number",
      label: "b₁",
      unit: "m/s²/sample",
    },
  ],
  title: "Strong Motion Linear Baseline Correction",
});
export const runStrongMotionLinearBaselineCorrection =
  strongMotionLinearBaselineCorrectionTool.execute;
export { strongMotionLinearBaselineCorrectionExample as example };
export default strongMotionLinearBaselineCorrectionTool;
