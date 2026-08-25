import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentGainLossInput = {
  readonly currentSpeedKt: number;
  readonly hoursOnCourse: number;
};

export type CurrentGainLossOutput = {
  readonly gainLossNm: number;
};

export const calculateCurrentGainLoss = (
  currentSpeedKt: number,
  hoursOnCourse: number,
): number | null =>
  Number.isFinite(currentSpeedKt) && hoursOnCourse >= 0
    ? currentSpeedKt * hoursOnCourse
    : null;

export const currentGainLossExample = {
  input: { currentSpeedKt: 2, hoursOnCourse: 1.5 },
  output: { gainLossNm: 3 },
} satisfies ToolExample<CurrentGainLossInput, CurrentGainLossOutput>;

export const currentGainLossTool = createSimpleTool({
  id: "sailing/current-gain-loss",
  title: "Current Gain Loss Calculator",
  description:
    "Calculate the distance gained or lost to the current along the course, with a favorable set positive and an adverse set negative.",
  inputs: [
    {
      id: "currentSpeedKt",
      kind: "number",
      label: "Current speed",
      unit: "kt",
    },
    {
      id: "hoursOnCourse",
      kind: "number",
      label: "Hours on course",
      unit: "h",
    },
  ],
  outputs: [
    {
      format: "distance-nm",
      id: "gainLossNm",
      kind: "number",
      label: "Gain or loss",
      unit: "nm",
    },
  ],
  calculate: (input) => {
    const current = input.currentSpeedKt as number;
    const hours = input.hoursOnCourse as number;
    const gainLossNm = calculateCurrentGainLoss(current, hours);
    if (gainLossNm === null)
      simpleError(
        hours <= 0 ? "hoursOnCourse" : "currentSpeedKt",
        "Enter a finite signed current speed and non-negative hours on course.",
        hours <= 0 ? "invalid_hours" : "invalid_current",
      );
    return { gainLossNm };
  },
});

export const runCurrentGainLoss = currentGainLossTool.execute;
export default currentGainLossTool;
