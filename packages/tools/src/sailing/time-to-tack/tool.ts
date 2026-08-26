import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeToTackInput = {
  boatSpeedKt: number;
  distanceToLaylineNm: number;
};

export type TimeToTackOutput = {
  timeMinutes: number;
};

export const timeToTackExample = {
  input: { boatSpeedKt: 5, distanceToLaylineNm: 1 },
  output: { timeMinutes: 12 },
} satisfies ToolExample<TimeToTackInput, TimeToTackOutput>;

export const calculateTimeToTack = (
  input: TimeToTackInput,
): TimeToTackOutput => {
  if (input.distanceToLaylineNm <= 0)
    simpleError(
      "distanceToLaylineNm",
      "Distance to layline must be positive.",
      "invalid_input",
    );
  if (input.boatSpeedKt <= 0)
    simpleError("boatSpeedKt", "Boat speed must be positive.", "invalid_input");
  return {
    timeMinutes: (input.distanceToLaylineNm / input.boatSpeedKt) * 60,
  };
};

export const timeToTackTool = createSimpleTool({
  calculate: (input) =>
    calculateTimeToTack(input as unknown as TimeToTackInput),
  description:
    "Compute minutes until the layline from minutes = distanceToLaylineNm / boatSpeedKt * 60.",
  id: "sailing/time-to-tack",
  inputs: [
    {
      description: "Distance to the layline.",
      id: "distanceToLaylineNm",
      kind: "number",
      label: "Distance to layline",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Boat speed upwind.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description: "Time remaining before reaching the layline.",
      format: "duration-min",
      id: "timeMinutes",
      kind: "number",
      label: "Time to tack",
      unit: "min",
    },
  ],
  title: "Time to Tack Calculator",
});
export const runTimeToTack = timeToTackTool.execute;
export default timeToTackTool;
