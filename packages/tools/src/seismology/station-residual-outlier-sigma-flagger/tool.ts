import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const stationResidualOutlierSigmaFlaggerExample = {
  input: {
    residualsSeconds: [
      0.02, 0.03, -0.04, 0.01, -0.02, 0.05, -0.03, 0.02, 0.04, 5,
    ],
    sigmaThreshold: 2.5,
  },
  output: (() => {
    const a = [0.02, 0.03, -0.04, 0.01, -0.02, 0.05, -0.03, 0.02, 0.04, 5];
    const n = a.length;
    const m = a.reduce((x, y) => x + y, 0) / n;
    const sd = Math.sqrt(a.reduce((acc, r) => acc + (r - m) ** 2, 0) / (n - 1));
    return { outlierIndices: [9], sampleStdDevSeconds: sd };
  })(),
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const stationResidualOutlierSigmaFlaggerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ residualsSeconds, sigmaThreshold }) => {
      const rs = residualsSeconds as unknown[];
      if (!Array.isArray(rs) || rs.length < 3)
        simpleError("residualsSeconds", "Provide at least three residuals.");
      const arr = rs as number[];
      const n = arr.length;
      const mean = arr.reduce((a, b) => a + b, 0) / n;
      const sd = Math.sqrt(
        arr.reduce((a, r) => a + (r - mean) ** 2, 0) / (n - 1),
      );
      const outlierIndices: number[] = [];
      arr.forEach((r, i) => {
        if (Math.abs(r - mean) > (sigmaThreshold ?? 2.5) * sd)
          outlierIndices.push(i);
      });
      return { outlierIndices, sampleStdDevSeconds: sd };
    })(input as never) as Record<string, unknown>,
  description:
    "Flag stations whose travel-time residuals exceed k standard deviations of the set.",
  id: "seismology/station-residual-outlier-sigma-flagger",
  inputs: [
    {
      description: "Station residuals.",
      id: "residualsSeconds",
      kind: "numberList",
      label: "r_i",
    },
    {
      default: 2.5,
      description: "Outlier threshold in sigmas.",
      id: "sigmaThreshold",
      kind: "number",
      label: "k",
    },
  ],
  outputs: [
    {
      description: "Zero-based indices of outliers.",
      id: "outlierIndices",
      kind: "numberList",
      label: "idx",
    },
    {
      description: "Sample standard deviation.",
      id: "sampleStdDevSeconds",
      kind: "number",
      label: "σ",
      unit: "s",
    },
  ],
  title: "Station Residual Outlier Sigma Flagger",
});
export const runStationResidualOutlierSigmaFlagger =
  stationResidualOutlierSigmaFlaggerTool.execute;
export { stationResidualOutlierSigmaFlaggerExample as example };
export default stationResidualOutlierSigmaFlaggerTool;
