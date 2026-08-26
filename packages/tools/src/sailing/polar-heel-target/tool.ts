import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PolarHeelTargetInput = {
  readonly windSpeedKt: number;
};

export type PolarHeelTargetOutput = {
  readonly targetHeelDeg: number;
};

export const polarHeelTargetExample = {
  input: { windSpeedKt: 12 },
  output: { targetHeelDeg: 10 },
} satisfies ToolExample<PolarHeelTargetInput, PolarHeelTargetOutput>;

const clampTarget = (value: number): number => Math.min(30, Math.max(5, value));

export const calculatePolarHeelTarget = (
  input: PolarHeelTargetInput,
): PolarHeelTargetOutput => {
  return {
    targetHeelDeg: clampTarget(Math.round(input.windSpeedKt * 0.8)),
  };
};

export const polarHeelTargetTool = createSimpleTool({
  calculate: (input) =>
    calculatePolarHeelTarget(input as unknown as PolarHeelTargetInput),
  description:
    "Guide the upwind heel angle as eight tenths of the wind speed in degrees, clamped between five and thirty degrees.",
  id: "sailing/polar-heel-target",
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
      description: "Recommended upwind heel angle in degrees.",
      format: "angle-deg",
      id: "targetHeelDeg",
      kind: "number",
      label: "Target heel",
      unit: "deg",
    },
  ],
  title: "Heel Target Guide",
});
export const runPolarHeelTarget = polarHeelTargetTool.execute;
export default polarHeelTargetTool;
