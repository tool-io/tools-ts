import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoorFrameBeadListInput = {
  readonly beadAllowanceMm?: number;
  readonly doorHeightMm: number;
  readonly doorWidthMm: number;
};

export type DoorFrameBeadListOutput = {
  readonly beadLengthMm: number;
  readonly framePieceCount: number;
};

export const doorFrameBeadListExample = {
  input: { beadAllowanceMm: 10, doorHeightMm: 2000, doorWidthMm: 600 },
  output: { beadLengthMm: 5240, framePieceCount: 4 },
} satisfies ToolExample<DoorFrameBeadListInput, DoorFrameBeadListOutput>;

export const doorFrameBeadListTool = createSimpleTool({
  id: "carpentry/tuer-stueckliste-rahmen-fuellung-leiste",
  title: "Door Frame Bead List Generator",
  description:
    "Compute the mitered frame piece count and decorative bead length for a framed door from door size and bead allowance.",
  inputs: [
    {
      description: "Width of the finished door in millimetres.",
      id: "doorWidthMm",
      kind: "number",
      label: "Door width",
      unit: "mm",
    },
    {
      description: "Height of the finished door in millimetres.",
      id: "doorHeightMm",
      kind: "number",
      label: "Door height",
      unit: "mm",
    },
    {
      default: 10,
      description:
        "Extra length per mitred corner for fitting the bead; ten millimetres is typical.",
      id: "beadAllowanceMm",
      kind: "number",
      label: "Bead allowance",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Four frame pieces: two stiles and two rails.",
      format: "count",
      id: "framePieceCount",
      kind: "integer",
      label: "Frame piece count",
    },
    {
      description:
        "Mitred perimeter with allowance: two times the sum of door width and height plus four times the bead allowance.",
      format: "length",
      id: "beadLengthMm",
      kind: "number",
      label: "Bead length",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const doorWidthMm = input.doorWidthMm as number;
    if (doorWidthMm <= 0)
      simpleError(
        "doorWidthMm",
        "The door width must be greater than zero millimetres.",
        "invalid_door_width",
      );
    const doorHeightMm = input.doorHeightMm as number;
    if (doorHeightMm <= 0)
      simpleError(
        "doorHeightMm",
        "The door height must be greater than zero millimetres.",
        "invalid_door_height",
      );
    const beadAllowanceMm = input.beadAllowanceMm as number;
    return {
      framePieceCount: 4,
      beadLengthMm: 2 * (doorWidthMm + doorHeightMm) + 4 * beadAllowanceMm,
    };
  },
});
export const runDoorFrameBeadList = doorFrameBeadListTool.execute;
export default doorFrameBeadListTool;
