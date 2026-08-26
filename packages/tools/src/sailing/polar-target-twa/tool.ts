import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PolarTargetTwaInput = {
  readonly windSpeedKt: number;
};

export type PolarTargetTwaOutput = {
  readonly targetTwaDeg: number;
};

export const polarTargetTwaExample = {
  input: { windSpeedKt: 12 },
  output: { targetTwaDeg: 39 },
} satisfies ToolExample<PolarTargetTwaInput, PolarTargetTwaOutput>;

const clampTarget = (value: number): number =>
  Math.min(55, Math.max(30, value));

export const calculatePolarTargetTwa = (
  input: PolarTargetTwaInput,
): PolarTargetTwaOutput => {
  return {
    targetTwaDeg: clampTarget(Math.round(45 - input.windSpeedKt * 0.5)),
  };
};

export const polarTargetTwaTool = createSimpleTool({
  calculate: (input) =>
    calculatePolarTargetTwa(input as unknown as PolarTargetTwaInput),
  description:
    "Guide the upwind target true wind angle as forty five degrees minus half the wind speed, clamped between thirty and fifty five degrees.",
  id: "sailing/polar-target-twa",
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
      description: "Recommended upwind true wind angle in degrees.",
      format: "angle-deg",
      id: "targetTwaDeg",
      kind: "number",
      label: "Target TWA",
      unit: "deg",
    },
  ],
  title: "Upwind TWA Guide",
});
export const runPolarTargetTwa = polarTargetTwaTool.execute;
export default polarTargetTwaTool;
