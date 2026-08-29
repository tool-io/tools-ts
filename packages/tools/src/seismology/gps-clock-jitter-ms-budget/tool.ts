import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const gpsClockJitterMsBudgetExample = {
  input: { jitterMs: 1 },
  output: { distanceBiasM: 6, acceptableForHypocenter: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gpsClockJitterMsBudgetTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ jitterMs, waveVelocityKmS }) => {
      const distanceBiasM = jitterMs * 1e-3 * waveVelocityKmS * 1000;
      return { distanceBiasM, acceptableForHypocenter: distanceBiasM < 50 };
    })(input as never) as Record<string, unknown>,
  description:
    "Timing jitter converted to equivalent travel-time distance bias at P-wave speed.",
  id: "seismology/gps-clock-jitter-ms-budget",
  inputs: [
    {
      minimum: 0,
      description: "Clock jitter (1-sigma).",
      id: "jitterMs",
      kind: "number",
      label: "δt",
      unit: "ms",
    },
    {
      default: 6,
      description: "Phase velocity.",
      id: "waveVelocityKmS",
      kind: "number",
      label: "v",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Equivalent location bias.",
      id: "distanceBiasM",
      kind: "number",
      label: "Δr",
      unit: "m",
    },
    {
      description: "Whether bias stays under a 50 m budget.",
      id: "acceptableForHypocenter",
      kind: "boolean",
      label: "OK",
    },
  ],
  title: "GPS Clock Jitter MS Budget Calculator",
});
export const runGpsClockJitterMsBudget = gpsClockJitterMsBudgetTool.execute;
export { gpsClockJitterMsBudgetExample as example };
export default gpsClockJitterMsBudgetTool;
