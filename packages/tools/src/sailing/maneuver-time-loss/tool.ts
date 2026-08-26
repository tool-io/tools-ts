import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ManeuverTimeLossInput = {
  readonly maneuverCount: number;
  readonly boatSpeedKt: number;
  readonly secondsPerManeuver?: number;
};

export type ManeuverTimeLossOutput = {
  readonly timeLossSeconds: number;
  readonly distanceLostNm: number;
};

const DEFAULT_SECONDS_PER_MANEUVER = 5;

export const maneuverTimeLossExample = {
  input: { maneuverCount: 8, boatSpeedKt: 6 },
  output: { timeLossSeconds: 40, distanceLostNm: 0.06666666666666667 },
} satisfies ToolExample<ManeuverTimeLossInput, ManeuverTimeLossOutput>;

export const calculateManeuverTimeLoss = (
  input: ManeuverTimeLossInput,
): ManeuverTimeLossOutput => {
  if (!(Number.isSafeInteger(input.maneuverCount) && input.maneuverCount >= 1))
    simpleError(
      "maneuverCount",
      "Maneuver count must be a positive integer.",
      "invalid_count",
    );
  if (!(input.boatSpeedKt > 0))
    simpleError("boatSpeedKt", "Boat speed must be positive.", "invalid_speed");
  const secondsPerManeuver =
    input.secondsPerManeuver ?? DEFAULT_SECONDS_PER_MANEUVER;
  if (!(Number.isFinite(secondsPerManeuver) && secondsPerManeuver >= 0))
    simpleError(
      "secondsPerManeuver",
      "Seconds lost per maneuver must be finite and non-negative.",
      "invalid_time",
    );
  const timeLossSeconds = input.maneuverCount * secondsPerManeuver;
  return {
    distanceLostNm: (timeLossSeconds * input.boatSpeedKt) / 3600,
    timeLossSeconds,
  };
};

export const maneuverTimeLossTool = createSimpleTool({
  id: "sailing/maneuver-time-loss",
  title: "Maneuver Time Loss",
  description:
    "Compute the total time and distance lost to a series of maneuvers from the maneuver count, seconds lost per maneuver, and boat speed.",
  inputs: [
    {
      description: "Number of maneuvers performed.",
      id: "maneuverCount",
      kind: "integer",
      label: "Maneuver count",
      minimum: 1,
    },
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      unit: "kt",
    },
    {
      default: DEFAULT_SECONDS_PER_MANEUVER,
      description: "Seconds lost for each maneuver.",
      id: "secondsPerManeuver",
      kind: "number",
      label: "Seconds per maneuver",
      maximum: 30,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total time lost to the maneuvers.",
      format: "duration-s",
      id: "timeLossSeconds",
      kind: "number",
      label: "Time loss",
      unit: "s",
    },
    {
      description: "Distance equivalent of the lost time.",
      format: "length-nm",
      id: "distanceLostNm",
      kind: "number",
      label: "Distance lost",
      unit: "nm",
    },
  ],
  calculate: (input) =>
    calculateManeuverTimeLoss(input as unknown as ManeuverTimeLossInput),
});

export const runManeuverTimeLoss = maneuverTimeLossTool.execute;
export default maneuverTimeLossTool;
