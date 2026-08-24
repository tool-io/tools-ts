import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LiCurveAnalysisInput = {
  readonly currentsMa: readonly number[];
  readonly powersMw: readonly number[];
  readonly tolerancePercent?: number;
};

export type LiCurveAnalysisOutput = {
  readonly thresholdCurrentMa: number;
  readonly slopeEfficiencyMwPerMa: number;
  readonly maxSlopeChangePercent: number;
  readonly kinkDetected: boolean;
};

/**
 * Least-squares fit of the upper half of the L-I curve gives the slope
 * efficiency and its zero-power intercept (the threshold current). Kinks show
 * up as large relative slope changes between consecutive segments that lie
 * entirely above that threshold.
 */
export const analyzeLiCurve = (
  currentsMa: readonly number[],
  powersMw: readonly number[],
  tolerancePercent = 30,
): LiCurveAnalysisOutput => {
  if (tolerancePercent < 0)
    simpleError("tolerancePercent", "Kink tolerance cannot be negative.");
  if (currentsMa.length !== powersMw.length || currentsMa.length < 3)
    simpleError(
      "currentsMa",
      "Provide equal-length current and power lists with at least three points.",
    );
  for (let i = 1; i < currentsMa.length; i += 1)
    if (currentsMa[i] <= currentsMa[i - 1])
      simpleError(
        "currentsMa",
        "Currents must increase strictly from point to point.",
      );
  const pMax = Math.max(...powersMw);
  if (!(pMax > 0))
    simpleError("powersMw", "Optical power never rises above zero.");

  const points = currentsMa
    .map((current, index) => ({ current, power: powersMw[index] }))
    .filter((point) => point.power >= pMax / 2);
  const n = points.length;
  if (n < 2)
    simpleError("powersMw", "Not enough points above half maximum to fit.");
  const meanX = points.reduce((total, point) => total + point.current, 0) / n;
  const meanY = points.reduce((total, point) => total + point.power, 0) / n;
  const denominator = points.reduce(
    (total, point) => total + (point.current - meanX) ** 2,
    0,
  );
  if (denominator === 0)
    simpleError("powersMw", "Top-half currents repeat; cannot fit a line.");
  const slope =
    points.reduce(
      (total, point) => total + (point.current - meanX) * (point.power - meanY),
      0,
    ) / denominator;
  if (slope <= 0)
    simpleError(
      "powersMw",
      "Power decreases in the top half; check the measurement ordering.",
    );
  const intercept = meanY - slope * meanX;
  const thresholdCurrentMa = -intercept / slope;

  const lasingSegmentSlopes: number[] = [];
  for (let j = 0; j < currentsMa.length - 1; j += 1) {
    const low = currentsMa[j];
    const high = currentsMa[j + 1];
    if (low > thresholdCurrentMa && high > thresholdCurrentMa)
      lasingSegmentSlopes.push((powersMw[j + 1] - powersMw[j]) / (high - low));
  }
  let maxSlopeChangePercent = 0;
  for (let k = 1; k < lasingSegmentSlopes.length; k += 1) {
    const previous = lasingSegmentSlopes[k - 1];
    const current = lasingSegmentSlopes[k];
    const scale = Math.abs(previous) + Math.abs(current);
    const change =
      (scale === 0 ? 0 : (2 * Math.abs(current - previous)) / scale) * 100;
    if (change > maxSlopeChangePercent) maxSlopeChangePercent = change;
  }

  return {
    thresholdCurrentMa,
    slopeEfficiencyMwPerMa: slope,
    maxSlopeChangePercent,
    kinkDetected: maxSlopeChangePercent > tolerancePercent,
  };
};

export const liCurveAnalysisExample = {
  input: {
    currentsMa: [5, 10, 15, 20, 25, 30, 35, 40],
    powersMw: [0, 0, 0, 0, 5, 10, 15, 20],
    tolerancePercent: 30,
  },
  output: {
    thresholdCurrentMa: 20,
    slopeEfficiencyMwPerMa: 1,
    maxSlopeChangePercent: 0,
    kinkDetected: false,
  },
} satisfies ToolExample<LiCurveAnalysisInput, LiCurveAnalysisOutput>;

export const liCurveAnalysisTool = createSimpleTool({
  calculate: (input) => {
    const analysis = analyzeLiCurve(
      input.currentsMa as readonly number[],
      input.powersMw as readonly number[],
      input.tolerancePercent as number,
    );
    return { ...analysis };
  },
  description:
    "Fit the linear section of a diode L-I curve to extract the threshold current and slope efficiency, and flag kinks from abnormal slope changes.",
  id: "laser/laser-diode-li-curve-kink-detection-threshold-extraction-method",
  inputs: [
    {
      description: "Ascending drive currents of the L-I sweep.",
      id: "currentsMa",
      kind: "numberList",
      label: "Currents",
      unit: "mA",
    },
    {
      description: "Matched optical power readings.",
      id: "powersMw",
      kind: "numberList",
      label: "Powers",
      unit: "mW",
    },
    {
      description:
        "Relative slope change between adjacent segments that counts as a kink.",
      default: 30,
      id: "tolerancePercent",
      kind: "number",
      label: "Kink tolerance",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Linear extrapolation of the lasing line to zero power.",
      id: "thresholdCurrentMa",
      kind: "number",
      label: "I_th",
      unit: "mA",
    },
    {
      description: "Above-threshold slope efficiency.",
      id: "slopeEfficiencyMwPerMa",
      kind: "number",
      label: "Slope efficiency",
      unit: "mW/mA",
    },
    {
      description:
        "Largest symmetric percent difference between adjacent lasing-segment slopes (0–200%).",
      id: "maxSlopeChangePercent",
      kind: "number",
      label: "Max slope change",
      unit: "%",
    },
    {
      description: "True when the largest slope change exceeds the tolerance.",
      id: "kinkDetected",
      kind: "boolean",
      label: "Kink detected",
    },
  ],
  title: "Diode L-I Kink Detection & Threshold Extraction",
});
export const runLiCurveAnalysis = liCurveAnalysisTool.execute;
export default liCurveAnalysisTool;

export { liCurveAnalysisExample as example };
