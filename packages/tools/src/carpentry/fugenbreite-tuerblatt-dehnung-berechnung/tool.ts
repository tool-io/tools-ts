import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DoorFrameGapInput = {
  readonly gapPerSideMm?: number;
  readonly leafWidthMm: number;
};

export type DoorFrameGapOutput = {
  readonly frameInnerWidthMm: number;
  readonly totalSideGapMm: number;
};

export const doorFrameGapExample = {
  input: { leafWidthMm: 600 },
  output: { frameInnerWidthMm: 606, totalSideGapMm: 6 },
} satisfies ToolExample<DoorFrameGapInput, DoorFrameGapOutput>;

export const doorFrameGapTool = createSimpleTool({
  id: "carpentry/fugenbreite-tuerblatt-dehnung-berechnung",
  title: "Door Frame Width With Gaps",
  description:
    "Compute door frame inner width and total side gap from the leaf width and per-side clearance.",
  inputs: [
    {
      description: "Width of the door leaf in millimetres.",
      id: "leafWidthMm",
      kind: "number",
      label: "Leaf width",
      unit: "mm",
    },
    {
      default: 3,
      description:
        "Clearance gap per side in millimetres, between zero and ten; three is typical.",
      id: "gapPerSideMm",
      kind: "number",
      label: "Gap per side",
      maximum: 10,
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Required frame inner width in millimetres: leaf width plus both gaps.",
      format: "length",
      id: "frameInnerWidthMm",
      kind: "number",
      label: "Frame inner width",
      unit: "mm",
    },
    {
      description: "Combined gap of both sides in millimetres.",
      format: "length",
      id: "totalSideGapMm",
      kind: "number",
      label: "Total side gap",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const leafWidthMm = input.leafWidthMm as number;
    if (!(leafWidthMm > 0))
      simpleError(
        "leafWidthMm",
        "The leaf width must be greater than zero millimetres.",
        "invalid_leaf_width",
      );
    const gapPerSideMm = input.gapPerSideMm as number;
    return {
      frameInnerWidthMm: leafWidthMm + 2 * gapPerSideMm,
      totalSideGapMm: 2 * gapPerSideMm,
    };
  },
});
export const runDoorFrameGap = doorFrameGapTool.execute;
export default doorFrameGapTool;
