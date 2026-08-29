import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const averageMomentRateFromMomentDurationExample = {
  input: { seismicMomentNm: 19000000000000000000, sourceDurationSeconds: 10 },
  output: {
    averageMomentRateNmS: 1900000000000000000,
    regimeNote: "ordinary dynamic rupture rates",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const averageMomentRateFromMomentDurationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ seismicMomentNm, sourceDurationSeconds }) => {
      if (seismicMomentNm <= 0)
        simpleError("seismicMomentNm", "Seismic moment must be positive.");
      if (sourceDurationSeconds <= 0)
        simpleError("sourceDurationSeconds", "Duration must be positive.");
      const rate = seismicMomentNm / sourceDurationSeconds;
      return {
        averageMomentRateNmS: rate,
        regimeNote:
          rate >= 1e18
            ? "ordinary dynamic rupture rates"
            : rate >= 1e16
              ? "slow earthquake territory"
              : "ultra-slow creep-like moment release",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Average seismic moment release rate over a specified source duration: Ṁ₀ = M₀/T.",
  id: "seismology/average-moment-rate-from-moment-duration",
  inputs: [
    {
      minimum: 0,
      description: "Radiated seismic moment.",
      id: "seismicMomentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
    {
      minimum: 0,
      description: "Source duration.",
      id: "sourceDurationSeconds",
      kind: "number",
      label: "T",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Mean moment rate.",
      id: "averageMomentRateNmS",
      kind: "number",
      label: "Ṁ₀",
      unit: "N·m/s",
    },
    {
      description: "Fast vs slow source regime hint.",
      id: "regimeNote",
      kind: "string",
      label: "Regime",
    },
  ],
  title: "Average Moment Rate From Moment Duration Calculator",
});
export const runAverageMomentRateFromMomentDuration =
  averageMomentRateFromMomentDurationTool.execute;
export { averageMomentRateFromMomentDurationExample as example };
export default averageMomentRateFromMomentDurationTool;
