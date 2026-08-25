import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type FavoredTackFromShiftInput = {
  readonly shiftDegrees: number;
};

export type FavoredTackFromShiftOutput = {
  readonly favoredTack: string;
};

export const favoredTackFromShiftExample = {
  input: { shiftDegrees: 15 },
  output: { favoredTack: "starboard" },
} satisfies ToolExample<FavoredTackFromShiftInput, FavoredTackFromShiftOutput>;

export const calculateFavoredTackFromShift = (
  input: FavoredTackFromShiftInput,
): FavoredTackFromShiftOutput => ({
  favoredTack:
    input.shiftDegrees > 0
      ? "starboard"
      : input.shiftDegrees < 0
        ? "port"
        : "even",
});

export const favoredTackFromShiftTool = createSimpleTool({
  id: "sailing/favored-tack-from-shift",
  title: "Favored Tack From Shift",
  description:
    "Determine the favored tack from a signed wind shift where a positive shift lifts the starboard tack and a negative shift lifts the port tack.",
  inputs: [
    {
      description:
        "Signed wind shift in degrees, positive for a starboard-tack lift.",
      id: "shiftDegrees",
      kind: "number",
      label: "Shift",
      maximum: 45,
      minimum: -45,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "The favored tack: port, starboard, or even.",
      id: "favoredTack",
      kind: "string",
      label: "Favored tack",
    },
  ],
  calculate: (input) =>
    calculateFavoredTackFromShift(
      input as unknown as FavoredTackFromShiftInput,
    ),
});

export const runFavoredTackFromShift = favoredTackFromShiftTool.execute;
export default favoredTackFromShiftTool;
