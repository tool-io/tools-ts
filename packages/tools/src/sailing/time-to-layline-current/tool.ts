import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeToLaylineCurrentInput = {
  readonly distanceToLaylineNm: number;
  readonly vmgKt: number;
};

export type TimeToLaylineCurrentOutput = {
  readonly timeMinutes: number;
};

const SECONDS_PER_MINUTE = 60;

export const calculateTimeToLaylineCurrent = (
  input: TimeToLaylineCurrentInput,
): TimeToLaylineCurrentOutput | null =>
  Number.isFinite(input.distanceToLaylineNm) &&
  Number.isFinite(input.vmgKt) &&
  input.distanceToLaylineNm > 0 &&
  input.vmgKt > 0
    ? {
        timeMinutes:
          (input.distanceToLaylineNm / input.vmgKt) * SECONDS_PER_MINUTE,
      }
    : null;

export const timeToLaylineCurrentExample = {
  input: { distanceToLaylineNm: 1.5, vmgKt: 4.5 },
  output: { timeMinutes: 20 },
} satisfies ToolExample<TimeToLaylineCurrentInput, TimeToLaylineCurrentOutput>;

export const timeToLaylineCurrentTool = createSimpleTool({
  id: "sailing/time-to-layline-current",
  title: "Time to Layline Current-Corrected",
  description:
    "Estimate the minutes remaining to the layline by dividing the current corrected distance to the layline by the velocity made good and converting to minutes.",
  inputs: [
    {
      description: "Distance to the layline measured on the water.",
      id: "distanceToLaylineNm",
      kind: "number",
      label: "Distance to layline",
      unit: "NM",
    },
    {
      description: "Velocity made good toward the layline.",
      id: "vmgKt",
      kind: "number",
      label: "VMG",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Minutes until the boat lays the mark approach.",
      format: "duration-min",
      id: "timeMinutes",
      kind: "number",
      label: "Time to layline",
      unit: "min",
    },
  ],
  calculate: (input) => {
    const timeMinutes = calculateTimeToLaylineCurrent(
      input as unknown as TimeToLaylineCurrentInput,
    );
    if (timeMinutes === null)
      simpleError(
        "distanceToLaylineNm",
        "Distance and VMG must be finite and greater than zero.",
        "invalid_value",
      );
    return timeMinutes;
  },
});

export const runTimeToLaylineCurrent = timeToLaylineCurrentTool.execute;
export default timeToLaylineCurrentTool;
