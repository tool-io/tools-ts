import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PolarTargetAwaInput = {
  readonly windSpeedKt: number;
};

export type PolarTargetAwaOutput = {
  readonly targetAwaDeg: number;
};

export const polarTargetAwaExample = {
  input: { windSpeedKt: 12 },
  output: { targetAwaDeg: 154 },
} satisfies ToolExample<PolarTargetAwaInput, PolarTargetAwaOutput>;

const clampTarget = (value: number): number =>
  Math.min(170, Math.max(135, value));

export const calculatePolarTargetAwa = (
  input: PolarTargetAwaInput,
): PolarTargetAwaOutput => {
  return {
    targetAwaDeg: clampTarget(Math.round(150 + input.windSpeedKt * 0.3)),
  };
};

export const polarTargetAwaTool = createSimpleTool({
  calculate: (input) =>
    calculatePolarTargetAwa(input as unknown as PolarTargetAwaInput),
  description:
    "Guide the downwind target apparent wind angle as one hundred fifty degrees plus three tenths of the wind speed, clamped between one hundred thirty five and one hundred seventy degrees.",
  id: "sailing/polar-target-awa",
  inputs: [
    {
      description: "True wind speed driving the polar.",
      format: "speed-kt",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Recommended downwind apparent wind angle in degrees.",
      format: "angle-deg",
      id: "targetAwaDeg",
      kind: "number",
      label: "Target AWA",
      unit: "deg",
    },
  ],
  title: "Downwind AWA Guide",
});
export const runPolarTargetAwa = polarTargetAwaTool.execute;
export default polarTargetAwaTool;
