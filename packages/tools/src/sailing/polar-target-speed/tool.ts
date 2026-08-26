import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolarTargetSpeedInput = {
  readonly efficiencyRatio?: number;
  readonly windSpeedKt: number;
};

export type PolarTargetSpeedOutput = {
  readonly targetBoatSpeedKt: number;
};

const DEFAULT_EFFICIENCY_RATIO = 0.5;

export const polarTargetSpeedExample = {
  input: { efficiencyRatio: 0.5, windSpeedKt: 12 },
  output: { targetBoatSpeedKt: 6 },
} satisfies ToolExample<PolarTargetSpeedInput, PolarTargetSpeedOutput>;

export const calculatePolarTargetSpeed = (
  input: PolarTargetSpeedInput,
): PolarTargetSpeedOutput => {
  const ratio = input.efficiencyRatio ?? DEFAULT_EFFICIENCY_RATIO;
  if (input.windSpeedKt <= 0)
    simpleError("windSpeedKt", "Wind speed must be positive.", "invalid_input");
  return { targetBoatSpeedKt: input.windSpeedKt * ratio };
};

export const polarTargetSpeedTool = createSimpleTool({
  calculate: (input) =>
    calculatePolarTargetSpeed(input as unknown as PolarTargetSpeedInput),
  description:
    "Compute the polar target boat speed by multiplying true wind speed by an efficiency ratio.",
  id: "sailing/polar-target-speed",
  inputs: [
    {
      description: "True wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      unit: "kt",
    },
    {
      default: DEFAULT_EFFICIENCY_RATIO,
      description:
        "Fraction of wind speed the boat is expected to achieve; zero point five approximates a cruising monohull.",
      id: "efficiencyRatio",
      kind: "number",
      label: "Efficiency ratio",
      maximum: 2,
      minimum: 0.1,
    },
  ],
  outputs: [
    {
      description: "Expected upwind-to-downwind average target speed.",
      format: "speed-kt",
      id: "targetBoatSpeedKt",
      kind: "number",
      label: "Target boat speed",
      unit: "kt",
    },
  ],
  title: "Polar Target Speed Calculator",
});
export const runPolarTargetSpeed = polarTargetSpeedTool.execute;
export default polarTargetSpeedTool;
