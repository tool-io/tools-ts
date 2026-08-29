import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const clockDriftPpmLinearRegressionExample = {
  input: { elapsedDays: [0, 10], offsetsSeconds: [0, 0.0864] },
  output: (() => {
    const T = [0, 10],
      O = [0, 0.0864];
    const n = 2;
    let sx = 0,
      sy = 0,
      sxx = 0,
      sxy = 0;
    for (let i = 0; i < n; i++) {
      sx += T[i];
      sy += O[i];
      sxx += T[i] * T[i];
      sxy += T[i] * O[i];
    }
    const den = n * sxx - sx * sx || 1e-12;
    const slope = (n * sxy - sx * sy) / den;
    return {
      driftSecondsPerDay: slope,
      driftPpm: (slope / 86400) * 1e6,
      interceptSeconds: (sy - slope * sx) / n,
    };
  })(),
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const clockDriftPpmLinearRegressionTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ elapsedDays, offsetsSeconds }) => {
      const ts = elapsedDays as unknown[];
      const os = offsetsSeconds as unknown[];
      if (
        !Array.isArray(ts) ||
        !Array.isArray(os) ||
        ts.length !== os.length ||
        ts.length < 2
      )
        simpleError(
          "elapsedDays",
          "Provide at least two matched observations.",
        );
      const n = ts.length;
      const T = ts as number[];
      const O = os as number[];
      let sx = 0,
        sy = 0,
        sxx = 0,
        sxy = 0;
      for (let i = 0; i < n; i++) {
        sx += T[i];
        sy += O[i];
        sxx += T[i] * T[i];
        sxy += T[i] * O[i];
      }
      const den = n * sxx - sx * sx;
      if (den === 0)
        simpleError(
          "elapsedDays",
          "Elapsed times must contain at least two distinct values.",
        );
      const slope = (n * sxy - sx * sy) / den;
      return {
        driftSecondsPerDay: slope,
        driftPpm: (slope / 86400) * 1e6,
        interceptSeconds: (sy - slope * sx) / n,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Least-squares drift rate in parts-per-million from timing offsets versus elapsed days.",
  id: "seismology/clock-drift-ppm-linear-regression",
  inputs: [
    {
      description: "Days since deployment start.",
      id: "elapsedDays",
      kind: "numberList",
      label: "t_i",
    },
    {
      description: "Measured clock offsets.",
      id: "offsetsSeconds",
      kind: "numberList",
      label: "δt_i",
    },
  ],
  outputs: [
    {
      description: "Drift rate per day.",
      id: "driftSecondsPerDay",
      kind: "number",
      label: "slope",
      unit: "s/d",
    },
    {
      description: "Drift in parts per million.",
      id: "driftPpm",
      kind: "number",
      label: "PPM",
    },
    {
      description: "Offset at t=0.",
      id: "interceptSeconds",
      kind: "number",
      label: "b₀",
      unit: "s",
    },
  ],
  title: "Clock Drift PPM Linear Regression Calculator",
});
export const runClockDriftPpmLinearRegression =
  clockDriftPpmLinearRegressionTool.execute;
export { clockDriftPpmLinearRegressionExample as example };
export default clockDriftPpmLinearRegressionTool;
