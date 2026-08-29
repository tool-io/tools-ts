import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rmsVelocityDixEquationIntervalVelocityCalculatorExample = {
  input: { rmsShallowMS: 2000, rmsDeepMS: 2500, twtShallowS: 1, twtDeepS: 2 },
  output: { intervalVelocityMS: 2915.4759474226503, dixValid: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const rmsVelocityDixEquationIntervalVelocityCalculatorTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ rmsShallowMS, rmsDeepMS, twtShallowS, twtDeepS }) => {
        const dt = twtDeepS - twtShallowS;
        if (dt <= 0)
          simpleError("twtDeepS", "Deep horizon time must exceed shallow.");
        const num = rmsDeepMS ** 2 * twtDeepS - rmsShallowMS ** 2 * twtShallowS;
        if (num <= 0)
          simpleError(
            "rmsDeepMS",
            "Dix numerator is non-positive; these RMS velocities admit no real interval velocity.",
            "dix_invalid",
          );
        return { intervalVelocityMS: Math.sqrt(num / dt), dixValid: true };
      })(input as never) as Record<string, unknown>,
    description:
      "Dix equation interval velocity between two horizons from RMS velocities and zero-offset times.",
    id: "seismology/rms-velocity-dix-equation-interval-velocity-calculator",
    inputs: [
      {
        minimum: 0,
        description: "RMS velocity to the shallow horizon.",
        id: "rmsShallowMS",
        kind: "number",
        label: "V₁",
        unit: "m/s",
      },
      {
        minimum: 0,
        description: "RMS velocity to the deep horizon.",
        id: "rmsDeepMS",
        kind: "number",
        label: "V₂",
        unit: "m/s",
      },
      {
        minimum: 0,
        description: "Zero-offset TWT of the shallow horizon.",
        id: "twtShallowS",
        kind: "number",
        label: "t₁",
        unit: "s",
      },
      {
        minimum: 0,
        description: "Zero-offset TWT of the deep horizon.",
        id: "twtDeepS",
        kind: "number",
        label: "t₂",
        unit: "s",
      },
    ],
    outputs: [
      {
        description: "Dix interval velocity.",
        id: "intervalVelocityMS",
        kind: "number",
        label: "V_int",
        unit: "m/s",
      },
      {
        description:
          "Always true on success; non-positive Dix numerators return a dix_invalid error instead of NaN.",
        id: "dixValid",
        kind: "boolean",
        label: "Valid?",
      },
    ],
    title: "RMS Velocity Dix Equation Interval Velocity Calculator",
  });
export const runRmsVelocityDixEquationIntervalVelocityCalculator =
  rmsVelocityDixEquationIntervalVelocityCalculatorTool.execute;
export { rmsVelocityDixEquationIntervalVelocityCalculatorExample as example };
export default rmsVelocityDixEquationIntervalVelocityCalculatorTool;
