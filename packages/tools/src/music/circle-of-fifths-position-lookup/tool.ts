import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CircleOfFifthsPositionLookupInput = Readonly<{
  readonly pitchClass: number;
}>;
export type CircleOfFifthsPositionLookupOutput = Readonly<{
  readonly clockwisePosition: number;
}>;

export const calculateCircleOfFifthsPositionLookup = (
  x: CircleOfFifthsPositionLookupInput,
): CircleOfFifthsPositionLookupOutput => {
  if (!Number.isFinite(x.pitchClass) || x.pitchClass < 0)
    simpleError("pitchClass", "Provide a finite nonnegative number.");
  if (!(Number.isInteger(x.pitchClass) && x.pitchClass < 12))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const clockwisePosition = (7 * x.pitchClass) % 12;
  if (!Number.isFinite(clockwisePosition))
    simpleError(
      "clockwisePosition",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    clockwisePosition: Object.is(clockwisePosition, -0) ? 0 : clockwisePosition,
  };
};

export const example = {
  input: {
    pitchClass: 7,
  },
  output: { clockwisePosition: 1 },
} satisfies ToolExample<
  CircleOfFifthsPositionLookupInput,
  CircleOfFifthsPositionLookupOutput
>;

export const tool = createSimpleTool({
  id: "music/circle-of-fifths-position-lookup",
  title: "Circle Of Fifths Position Lookup",
  description:
    "Clockwise circle-of-fifths position 0–11 from a chromatic pitch class (C=0, C-sharp=1, ... B=11).",
  inputs: [
    { id: "pitchClass", kind: "number", label: "Pitch Class", minimum: 0 },
  ],
  outputs: [
    { id: "clockwisePosition", kind: "number", label: "Clockwise Position" },
  ],
  calculate: (input) =>
    calculateCircleOfFifthsPositionLookup({
      pitchClass: input.pitchClass as number,
    }),
});
export const circleOfFifthsPositionLookupTool = tool;
export const runCircleOfFifthsPositionLookup = tool.execute;
export default tool;
