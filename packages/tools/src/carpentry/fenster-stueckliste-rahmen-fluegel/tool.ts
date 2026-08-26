import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindowFrameListInput = {
  readonly frameOuterHeightMm: number;
  readonly frameOuterWidthMm: number;
  readonly sashCount?: number;
};

export type WindowFrameListOutput = {
  readonly framePieceCount: number;
  readonly glazingBeadLengthMm: number;
  readonly sashPerFrame: number;
};

export const windowFrameListExample = {
  input: { frameOuterHeightMm: 1200, frameOuterWidthMm: 1000, sashCount: 2 },
  output: { framePieceCount: 4, glazingBeadLengthMm: 4400, sashPerFrame: 2 },
} satisfies ToolExample<WindowFrameListInput, WindowFrameListOutput>;

export const windowFrameListTool = createSimpleTool({
  id: "carpentry/fenster-stueckliste-rahmen-fluegel",
  title: "Window Frame List Generator",
  description:
    "Compute the frame piece count, sash count, and glazing bead length for a window frame from its outer size.",
  inputs: [
    {
      description: "Outer width of the window frame in millimetres.",
      id: "frameOuterWidthMm",
      kind: "number",
      label: "Frame outer width",
      unit: "mm",
    },
    {
      description: "Outer height of the window frame in millimetres.",
      id: "frameOuterHeightMm",
      kind: "number",
      label: "Frame outer height",
      unit: "mm",
    },
    {
      default: 2,
      description:
        "Number of opening sashes per frame; two is typical for a casement pair.",
      id: "sashCount",
      kind: "integer",
      label: "Sash count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Four frame pieces per window frame.",
      format: "count",
      id: "framePieceCount",
      kind: "integer",
      label: "Frame piece count",
    },
    {
      description: "Number of sashes built into the frame.",
      format: "count",
      id: "sashPerFrame",
      kind: "integer",
      label: "Sashes per frame",
    },
    {
      description:
        "Perimeter of the frame outer rectangle: two times the sum of outer width and outer height.",
      format: "length",
      id: "glazingBeadLengthMm",
      kind: "number",
      label: "Glazing bead length",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const frameOuterWidthMm = input.frameOuterWidthMm as number;
    if (frameOuterWidthMm <= 0)
      simpleError(
        "frameOuterWidthMm",
        "The frame outer width must be greater than zero millimetres.",
        "invalid_frame_width",
      );
    const frameOuterHeightMm = input.frameOuterHeightMm as number;
    if (frameOuterHeightMm <= 0)
      simpleError(
        "frameOuterHeightMm",
        "The frame outer height must be greater than zero millimetres.",
        "invalid_frame_height",
      );
    return {
      framePieceCount: 4,
      sashPerFrame: input.sashCount as number,
      glazingBeadLengthMm: 2 * (frameOuterWidthMm + frameOuterHeightMm),
    };
  },
});
export const runWindowFrameList = windowFrameListTool.execute;
export default windowFrameListTool;
