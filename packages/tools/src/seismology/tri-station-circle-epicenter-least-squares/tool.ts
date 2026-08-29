import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const triStationCircleEpicenterLeastSquaresExample = {
  input: {
    stationXKm: [10, -5, -5],
    stationYKm: [0, 8.660254037844386, -8.660254037844386],
    distancesKm: [10, 10, 10],
  },
  output: { epicenterXKm: 0, epicenterYKm: 0, residualKm: 0 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const triStationCircleEpicenterLeastSquaresTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ stationXKm, stationYKm, distancesKm }) => {
      const xs = stationXKm as unknown[];
      const ys = stationYKm as unknown[];
      const ds = distancesKm as unknown[];
      const n = Array.isArray(xs) ? xs.length : 0;
      if (
        !Array.isArray(xs) ||
        !Array.isArray(ys) ||
        !Array.isArray(ds) ||
        n !== ys.length ||
        n !== ds.length ||
        n < 3
      )
        simpleError("stationXKm", "Provide three or more matching stations.");
      if (n * 60 > toolResourceLimits.iterations)
        simpleError(
          "stationXKm",
          `Solver work cannot exceed ${toolResourceLimits.iterations} station iterations.`,
          "resource_limit_exceeded",
        );
      const X = xs as number[];
      const Y = ys as number[];
      const D = ds as number[];
      if (D.some((distance) => distance < 0))
        simpleError("distancesKm", "Distances cannot be negative.");
      let px = X.reduce((a, b) => a + b, 0) / n;
      let py = Y.reduce((a, b) => a + b, 0) / n;
      for (let iter = 0; iter < 60; iter++) {
        let j11 = 0,
          j12 = 0,
          j22 = 0,
          g1 = 0,
          g2 = 0;
        for (let i = 0; i < n; i++) {
          const dx = px - X[i];
          const dy = py - Y[i];
          const r = Math.hypot(dx, dy) || 1e-9;
          const f = r - D[i];
          const ux = dx / r;
          const uy = dy / r;
          j11 += ux * ux;
          j12 += ux * uy;
          j22 += uy * uy;
          g1 += ux * f;
          g2 += uy * f;
        }
        const det = j11 * j22 - j12 * j12;
        if (Math.abs(det) <= Number.EPSILON * Math.max(1, j11 * j22))
          simpleError(
            "stationXKm",
            "Station geometry does not constrain a unique 2-D location.",
          );
        px -= (j22 * g1 - j12 * g2) / det;
        py -= (j11 * g2 - j12 * g1) / det;
      }
      let sse = 0;
      for (let i = 0; i < n; i++) {
        const e = Math.hypot(px - X[i], py - Y[i]) - D[i];
        sse += e * e;
      }
      return {
        epicenterXKm: px,
        epicenterYKm: py,
        residualKm: Math.sqrt(sse / n),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Epicenter from three S-P distance circles via Gauss-Newton least squares.",
  id: "seismology/tri-station-circle-epicenter-least-squares",
  inputs: [
    {
      description: "Station eastings (km).",
      id: "stationXKm",
      kind: "numberList",
      label: "x_i",
    },
    {
      description: "Station northings (km).",
      id: "stationYKm",
      kind: "numberList",
      label: "y_i",
    },
    {
      description: "Hypocentral-projected distances.",
      id: "distancesKm",
      kind: "numberList",
      label: "d_i",
    },
  ],
  outputs: [
    {
      description: "Estimated easting.",
      id: "epicenterXKm",
      kind: "number",
      label: "x₀",
      unit: "km",
    },
    {
      description: "Estimated northing.",
      id: "epicenterYKm",
      kind: "number",
      label: "y₀",
      unit: "km",
    },
    {
      description: "Circle-fit residual RMS.",
      id: "residualKm",
      kind: "number",
      label: "rms",
      unit: "km",
    },
  ],
  title: "Tri Station Circle Epicenter Least Squares Solver",
});
export const runTriStationCircleEpicenterLeastSquares =
  triStationCircleEpicenterLeastSquaresTool.execute;
export { triStationCircleEpicenterLeastSquaresExample as example };
export default triStationCircleEpicenterLeastSquaresTool;
