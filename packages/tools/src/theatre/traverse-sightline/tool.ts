import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly viewerAnglesDegrees: readonly number[];
  readonly minimumClearAngleDegrees: number;
}>;
export type Output = Readonly<{
  readonly clearSeatCount: number;
  readonly blockedSeatCount: number;
  readonly clearSeatPercent: number;
  readonly worstAngleDegrees: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.viewerAnglesDegrees.length === 0)
    simpleError(
      "viewerAnglesDegrees",
      "At least one sightline angle is required.",
      "empty_angles",
    );
  const clearSeatCount = input.viewerAnglesDegrees.filter(
    (value) => value >= input.minimumClearAngleDegrees,
  ).length;
  return {
    clearSeatCount,
    blockedSeatCount: input.viewerAnglesDegrees.length - clearSeatCount,
    clearSeatPercent: (clearSeatCount / input.viewerAnglesDegrees.length) * 100,
    worstAngleDegrees: Math.min(...input.viewerAnglesDegrees),
  };
};

export const exampleInput = {
  viewerAnglesDegrees: [10, 5, -2, 8],
  minimumClearAngleDegrees: 5,
} satisfies Input;
export const exampleOutput = {
  clearSeatCount: 3,
  blockedSeatCount: 1,
  clearSeatPercent: 75,
  worstAngleDegrees: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      viewerAnglesDegrees: input.viewerAnglesDegrees as readonly number[],
      minimumClearAngleDegrees: input.minimumClearAngleDegrees as number,
    }),
  description:
    "Summarize traverse-stage sightline angles against a supplied clearance minimum.",
  id: "theatre/traverse-sightline",
  inputs: [
    {
      id: "viewerAnglesDegrees",
      label: "Traverse audience sightline angles",
      kind: "numberList",
      unit: "°",
    },
    {
      id: "minimumClearAngleDegrees",
      label: "Minimum clear angle",
      kind: "number",
      unit: "°",
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
      id: "blockedSeatCount",
      label: "Blocked seat count",
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
      id: "worstAngleDegrees",
      label: "Worst sightline angle",
      kind: "number",
      unit: "°",
    },
  ],
  title: "Traverse Sightline",
});

export const run = tool.execute;
export default tool;
