import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cumulativeAbsoluteVelocityCaiExample = {
  input: { accelerationsMS2: [1, -2, 2, -1], sampleIntervalS: 0.02 },
  output: { cavMS: 0.12 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const cumulativeAbsoluteVelocityCaiTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ accelerationsMS2, sampleIntervalS }) => {
      const xs = accelerationsMS2 as unknown[];
      if (!Array.isArray(xs) || xs.length === 0)
        simpleError("accelerationsMS2", "Provide at least one sample.");
      if (!(sampleIntervalS > 0))
        simpleError("sampleIntervalS", "Sample interval must be positive.");
      return {
        cavMS:
          (xs as number[]).reduce((a, x) => a + Math.abs(x), 0) *
          sampleIntervalS,
      };
    })(input as never) as Record<string, unknown>,
  description: "CAV = Σ|a|·Δt over uniformly sampled acceleration.",
  id: "seismology/cumulative-absolute-velocity-cai",
  inputs: [
    {
      description: "Acceleration samples.",
      id: "accelerationsMS2",
      kind: "numberList",
      label: "a_i",
    },
    {
      minimum: 0,
      description: "Sampling interval.",
      id: "sampleIntervalS",
      kind: "number",
      label: "Δt",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Cumulative absolute velocity.",
      id: "cavMS",
      kind: "number",
      label: "CAV",
      unit: "m/s",
    },
  ],
  title: "Cumulative Absolute Velocity CAV Calculator",
});
export const runCumulativeAbsoluteVelocityCai =
  cumulativeAbsoluteVelocityCaiTool.execute;
export { cumulativeAbsoluteVelocityCaiExample as example };
export default cumulativeAbsoluteVelocityCaiTool;
