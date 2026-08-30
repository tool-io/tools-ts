import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly seatSightlineAnglesDegrees: readonly number[];
  readonly minimumSightlineAngleDegrees: number;
  readonly targetClearSeatPercent: number;
}>;
export type Output = Readonly<{
  readonly clearSeatCount: number;
  readonly clearSeatPercent: number;
  readonly targetMarginPoints: number;
  readonly meetsTarget: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.seatSightlineAnglesDegrees.length === 0)
    simpleError(
      "seatSightlineAnglesDegrees",
      "At least one seat angle is required.",
      "empty_angles",
    );
  const clearSeatCount = input.seatSightlineAnglesDegrees.filter(
    (value) => value >= input.minimumSightlineAngleDegrees,
  ).length;
  const clearSeatPercent =
    (clearSeatCount / input.seatSightlineAnglesDegrees.length) * 100;
  return {
    clearSeatCount,
    clearSeatPercent,
    targetMarginPoints: clearSeatPercent - input.targetClearSeatPercent,
    meetsTarget: clearSeatPercent >= input.targetClearSeatPercent,
  };
};

export const exampleInput = {
  seatSightlineAnglesDegrees: [6, 7, 2, 8],
  minimumSightlineAngleDegrees: 5,
  targetClearSeatPercent: 75,
} satisfies Input;
export const exampleOutput = {
  clearSeatCount: 3,
  clearSeatPercent: 75,
  targetMarginPoints: 0,
  meetsTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      seatSightlineAnglesDegrees:
        input.seatSightlineAnglesDegrees as readonly number[],
      minimumSightlineAngleDegrees:
        input.minimumSightlineAngleDegrees as number,
      targetClearSeatPercent: input.targetClearSeatPercent as number,
    }),
  description:
    "Check thrust-stage seat sightlines against supplied angle and coverage targets.",
  id: "theatre/thrust-sightline",
  inputs: [
    {
      id: "seatSightlineAnglesDegrees",
      label: "Thrust-stage seat sightline angles",
      kind: "numberList",
      unit: "°",
    },
    {
      id: "minimumSightlineAngleDegrees",
      label: "Minimum sightline angle",
      kind: "number",
      unit: "°",
    },
    {
      id: "targetClearSeatPercent",
      label: "Target clear-seat share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "clearSeatCount",
      label: "Clear seat count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "clearSeatPercent",
      label: "Clear seat share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "targetMarginPoints",
      label: "Clear-seat target margin",
      kind: "number",
      unit: "percentage points",
    },
    { id: "meetsTarget", label: "Meets supplied target", kind: "boolean" },
  ],
  title: "Thrust Sightline",
});

export const run = tool.execute;
export default tool;
