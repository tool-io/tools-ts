import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FigureEightRecoveryTimeInput = {
  readonly approachMinutes?: number;
  readonly boatSpeedKt: number;
  readonly circleDiameterNm: number;
};

export type FigureEightRecoveryTimeOutput = {
  readonly recoveryTimeMinutes: number;
};

const FIGURE_EIGHT_CIRCUMFERENCE_MULTIPLIER = 2 * Math.PI;
const MINUTES_PER_HOUR = 60;
const DEFAULT_APPROACH_MINUTES = 2;
const MAX_APPROACH_MINUTES = 15;

export const calculateFigureEightRecoveryTime = (
  input: FigureEightRecoveryTimeInput,
): FigureEightRecoveryTimeOutput | null => {
  const approachMinutes = input.approachMinutes ?? DEFAULT_APPROACH_MINUTES;
  return Number.isFinite(input.circleDiameterNm) &&
    Number.isFinite(input.boatSpeedKt) &&
    Number.isFinite(approachMinutes) &&
    input.circleDiameterNm > 0 &&
    input.boatSpeedKt > 0
    ? {
        recoveryTimeMinutes:
          ((FIGURE_EIGHT_CIRCUMFERENCE_MULTIPLIER * input.circleDiameterNm) /
            input.boatSpeedKt) *
            MINUTES_PER_HOUR +
          approachMinutes,
      }
    : null;
};

export const figureEightRecoveryTimeExample = {
  input: {
    approachMinutes: 2,
    boatSpeedKt: 6,
    circleDiameterNm: 0.5,
  },
  output: { recoveryTimeMinutes: 33.415926535897924 },
} satisfies ToolExample<
  FigureEightRecoveryTimeInput,
  FigureEightRecoveryTimeOutput
>;

export const figureEightRecoveryTimeTool = createSimpleTool({
  id: "sailing/figure-eight-recovery-time",
  title: "Figure Eight Recovery Time",
  description:
    "Estimate the minutes to sail two circular lobes of a figure-eight recovery path at the given boat speed, plus the final approach allowance.",
  inputs: [
    {
      description: "Diameter of each circle of the figure eight.",
      id: "circleDiameterNm",
      kind: "number",
      label: "Circle diameter",
      unit: "NM",
    },
    {
      description: "Boat speed held through the maneuver.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      unit: "kt",
    },
    {
      default: DEFAULT_APPROACH_MINUTES,
      description: "Minutes allowed for the final approach to the casualty.",
      id: "approachMinutes",
      kind: "number",
      label: "Approach time",
      maximum: MAX_APPROACH_MINUTES,
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Total minutes to complete the recovery maneuver.",
      format: "duration-min",
      id: "recoveryTimeMinutes",
      kind: "number",
      label: "Recovery time",
      unit: "min",
    },
  ],
  calculate: (input) => {
    const recoveryTimeMinutes = calculateFigureEightRecoveryTime(
      input as unknown as FigureEightRecoveryTimeInput,
    );
    if (recoveryTimeMinutes === null)
      simpleError(
        "circleDiameterNm",
        "Circle diameter and boat speed must be finite and greater than zero.",
        "invalid_value",
      );
    return recoveryTimeMinutes;
  },
});

export const runFigureEightRecoveryTime = figureEightRecoveryTimeTool.execute;
export default figureEightRecoveryTimeTool;
