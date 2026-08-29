import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const pWaveAzimuthalResidualVectorSumSplitExample = {
  input: { azimuthsDeg: [0, 90], residualsSeconds: [1, 0] },
  output: {
    vectorSumMagnitudeSeconds: 1,
    systematicAzimuthDeg: 0,
    randomSharePercent: 0,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const pWaveAzimuthalResidualVectorSumSplitTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ azimuthsDeg, residualsSeconds }) => {
      const A = azimuthsDeg as unknown[];
      const R = residualsSeconds as unknown[];
      if (
        !Array.isArray(A) ||
        !Array.isArray(R) ||
        A.length !== R.length ||
        A.length < 2
      )
        simpleError("azimuthsDeg", "Provide matched azimuth/residual pairs.");
      let cx = 0,
        cy = 0,
        cc = 0,
        ss = 0,
        cs = 0;
      for (let i = 0; i < A.length; i++) {
        const rad = ((A as number[])[i] * Math.PI) / 180;
        const cosine = Math.cos(rad);
        const sine = Math.sin(rad);
        cx += cosine * (R as number[])[i];
        cy += sine * (R as number[])[i];
        cc += cosine * cosine;
        ss += sine * sine;
        cs += cosine * sine;
      }
      const mag = Math.hypot(cx, cy);
      const phi = ((Math.atan2(cy, cx) * 180) / Math.PI + 360) % 360;
      const determinant = cc * ss - cs * cs;
      if (Math.abs(determinant) < 1e-12)
        simpleError(
          "azimuthsDeg",
          "Azimuths must span at least two independent directions.",
        );
      const cosineCoefficient = (ss * cx - cs * cy) / determinant;
      const sineCoefficient = (cc * cy - cs * cx) / determinant;
      let sse = 0;
      for (let i = 0; i < A.length; i++) {
        const rad = ((A as number[])[i] * Math.PI) / 180;
        const pred =
          Math.cos(rad) * cosineCoefficient + Math.sin(rad) * sineCoefficient;
        sse += ((R as number[])[i] - pred) ** 2;
      }
      let sst = 0;
      for (const r of R as number[]) sst += r * r;
      const randomSharePercent = sst > 0 ? (sse / sst) * 100 : 0;
      return {
        vectorSumMagnitudeSeconds: mag,
        systematicAzimuthDeg: phi,
        randomSharePercent,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Summarize the first azimuthal harmonic of P-wave residuals and use a least-squares cosine/sine fit to separate systematic directional variation from residual scatter.",
  id: "seismology/p-wave-azimuthal-residual-vector-sum-split",
  inputs: [
    {
      description: "Station azimuths.",
      id: "azimuthsDeg",
      kind: "numberList",
      label: "az_i",
    },
    {
      description: "Signed P residuals.",
      id: "residualsSeconds",
      kind: "numberList",
      label: "r_i",
    },
  ],
  outputs: [
    {
      description: "Magnitude of the residual-weighted direction sum.",
      id: "vectorSumMagnitudeSeconds",
      kind: "number",
      label: "|Σr·û|",
      unit: "s",
    },
    {
      description: "Azimuth of the systematic component.",
      id: "systematicAzimuthDeg",
      kind: "number",
      label: "φ_sys",
      unit: "°",
    },
    {
      description: "Share of variance not explained by the systematic term.",
      id: "randomSharePercent",
      kind: "number",
      label: "rand%",
      unit: "%",
    },
  ],
  title: "P Wave Azimuthal Residual Vector Sum Split",
});
export const runPWaveAzimuthalResidualVectorSumSplit =
  pWaveAzimuthalResidualVectorSumSplitTool.execute;
export { pWaveAzimuthalResidualVectorSumSplitExample as example };
export default pWaveAzimuthalResidualVectorSumSplitTool;
